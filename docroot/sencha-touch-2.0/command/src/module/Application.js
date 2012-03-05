/**
 * @class Command.module.Application
 * @author Jacky Nguyen <jacky@sencha.com>
 */
Ext.define('Command.module.Application', {
    extend: 'Command.module.Abstract',

    description: 'Resolve application dependencies and build for production',

    actions: {
        create: [
            "(Alias to 'sencha generate app') Generate a new project with the recommended structure",
            ['name', 'n', 'The namespace of the application to create. ' +
                'This will be used as the prefix for all your classes', 'string', null, 'MyApp'],
            ['path', 'p', 'The directory path to generate this application to.', 'string', null, '/path/to/myapp'],
            ['library', 'l', "The library's build to develop your application with, either 'core' or 'all'. " +
                "Defaults to 'core'", 'string', 'core', 'all']
        ],
        resolve: [
            "Generate a list of dependencies in the exact loading order for the given application. " +
            "Note that the resolved paths are relative to the given application's HTML document",
            ['uri', 'u', 'The URI to the application\'s HTML document', 'string', null, 'http://localhost/myapp/index.html'],
            ['output', 'o', 'The file path to write the results to in JSON format.', 'string', null, 'dependencies.json']
        ],
        build: [
            "Build the application at the current working directory to the given path",
            ['environment', 'e', "The build environment, either 'testing', 'production' or 'native'. Defaults to 'testing'",
                'string', 'testing', 'production'],
            ['destination', 'd', "The directory path to build this application to. " +
                "If none given, the default path specified inside 'app.json' is used", 'string', '', '/path/to/deploy/myapp'],
            ['archive', 'a', "The directory path where all previous builds were stored," +
                "needed to generate deltas between updates (for production only). " +
                "If none given, the default path specified inside 'app.json' is used",
                'string', '', '/path/to/myapp/archive']
        ]
    },

    create: function() {
        var module = this.getModule('generate');

        module.app.apply(module, arguments);
    },

    resolve: function(uri, output, callback) {
        var command = '%s %s %s',
            parsedUri = require('url').parse(uri);

        if (!/^file|http/.test(parsedUri.protocol)) {
            uri = 'file:///' + require('path').resolve(uri).replace(/\\/g, '/');
        }

        command = require('util').format(command,
            this.escapeShell(this.getVendorPath('phantomjs/' + this.cli.platformName + '/phantomjs')),
            this.escapeShell(this.getVendorPath('phantomjs/dependencies.js')),
            this.escapeShell(uri)
        );

        require('child_process').exec(command,
            function(error, stdout) {
                if (error) {
                    this.error(stdout);
                }
                else {
                    if (output) {
                        this.getModule('fs').write(output, stdout);
                    }

                    if (callback) {
                        callback(JSON.parse(stdout));
                    }
                }
            }.bind(this)
        );
    },

    build: function(environment, destination, archive) {
        var needsPackaging = false;

        if (environment == 'native') {
            environment = 'testing';
            needsPackaging = true;
        }

        if (environment !== 'testing' && environment !== 'production') {
            throw new Error("Invalid environment argument of: '"+environment+"', must be either 'testing' or 'production'");
        }

        var path = require('path'),
            src = process.cwd(),
            fs = this.getModule('fs'),
            config = fs.readJson(path.join(src, 'app.json')),
            jsAssets = config.js || [],
            cssAssets = config.css || [],
            extras = config.extras,
            appCache = config.appCache,
            preprocessor = Ext.require('Command.Preprocessor').getInstance(),
            nodeFs = require('fs'),
            indexHtml, assets, file, destinationFile, files,
            appJs, appJson, assetsCount, processedAssetsCount,
            packagerConfig, packagerJson;

        preprocessor.setParams(config.preprocessor || {});

        if (!destination) {
            destination = config.buildPath[environment];
        }

        if (!archive) {
            archive = config.archivePath;
        }

        destination = path.resolve(destination);
        archive = path.resolve(archive);

        appJs = path.join(destination, 'app.js');

        this.info("Deploying your application to " + destination);

        fs.mkdir(destination);

        jsAssets = jsAssets.map(function(asset) {
            if (typeof asset == 'string') {
                asset = { path: asset };
            }
            asset.type = 'js';
            return asset;
        });

        cssAssets = cssAssets.map(function(asset) {
            if (typeof asset == 'string') {
                asset = { path: asset };
            }
            asset.type = 'css';
            return asset;
        });

        assets = jsAssets.concat(cssAssets).filter(function(asset) {
            return !asset.shared || (environment != 'production');
        });

        assets.forEach(function(asset) {
            file = asset.path;
            fs.copyFile(path.join(src, file), path.join(destination, file));
            this.info("Copied " + file);
        }, this);

        extras.forEach(function(extra) {
            fs.copy(path.join(src, extra), path.join(destination, extra));
            this.info("Copied " + extra);
        }, this);

        this.info("Resolving your application dependencies...");

        this.resolve(path.join(src, 'index.html'), null, function(dependencies) {
            this.info("Found " + dependencies.length + " dependencies. Concatenating all into app.js...");

            files = dependencies.map(function(dependency) {
                return path.join(src, dependency.path);
            });

            files.push(appJs);

            fs.concat(files, path.join(destination, 'app.all.js'), "\n");

            nodeFs.unlinkSync(appJs);
            nodeFs.renameSync(path.join(destination, 'app.all.js'), appJs);

            processedAssetsCount = 0;
            assetsCount = assets.length;
            assets.forEach(function(asset) {
                file = asset.path;
                destinationFile = path.join(destination, file);

                if (asset.type == 'js') {
                    fs.write(destinationFile, preprocessor.process(destinationFile));
                    this.info("Processed " + file);
                }

                this.info("Minifying " + file);

                fs.minify(destinationFile, destinationFile, null, function(destinationFile, file, asset) {
                    this.info("Minified " + file);

                    if (environment == 'production') {
                        var version = fs.checksum(destinationFile);
                        asset.version = version;

                        fs.copyFile(destinationFile, path.join(archive, file, version));

                        if (asset.update === 'delta') {
                            nodeFs.readdirSync(path.join(archive, file)).forEach(function(archivedVersion) {
                                if (archivedVersion === version) {
                                    return;
                                }

                                var deltaFile = path.join(destination, 'deltas', file, archivedVersion + '.json');

                                fs.write(deltaFile, '');
                                fs.delta(
                                    path.join(archive, file, archivedVersion), destinationFile, deltaFile,
                                    function() {
                                        this.info("Generated delta for: '" + file + "' from hash: '" +
                                            archivedVersion + "' to hash: '" + version + "'");
                                    }.bind(this)
                                );

                            }, this);
                        }
                    }

                    if (++processedAssetsCount == assetsCount) {
                        appJson = JSON.stringify({
                            js: jsAssets,
                            css: cssAssets
                        }, null, 4);

                        fs.write(path.join(destination, 'app.json'), appJson);
                        this.info("Generated app.json");

                        indexHtml = fs.read(path.join(src, 'index.html'));

                        if (environment == 'production' && appCache) {
                            indexHtml = indexHtml.replace('<html manifest=""', '<html manifest="app.manifest"');
                        }

                        indexHtml = indexHtml.replace(/<script id="microloader"([^<]+)<\/script>/,
                            '<script type="text/javascript">' +
                                fs.read(path.join(src, 'sdk', 'sencha-'+environment+'.js')) +
                                'Ext.blink(' + appJson + ')' +
                            '</script>');

                        fs.write(path.join(destination, 'index.html'), indexHtml);
                        this.info("Embedded microloader into index.html");

                        if (environment == 'production' && appCache) {
                            appCache.cache = appCache.cache.map(function(cache) {
                                var checksum = '';

                                if (!/^(\/|(.*):\/\/)/.test(cache)) {
                                    this.info("Generating checksum for appCache item: " + cache);
                                    checksum = fs.checksum(path.join(destination, cache));
                                }

                                return {
                                    uri: cache,
                                    checksum: checksum
                                }
                            }, this);

                            fs.write(path.join(destination, 'app.manifest'), this.getTemplate('app.manifest').apply(appCache));
                            this.info("Generated app.manifest");
                        }

                        if (needsPackaging) {
                            packagerJson = fs.read(path.join(src, 'packager.json'));
                            packagerConfig = Ext.JSON.decode(packagerJson);
                            packagerConfig.inputPath = destination;
                            packagerConfig.outputPath = path.resolve(config.buildPath.native);
                            fs.mkdir(packagerConfig.outputPath);
                            fs.writeJson(path.join(src, 'packager.json'), packagerConfig);

                            this.info("Packaging your application as a native app...");
                            require('child_process').exec('sencha package run', function(error, stdout, stderr) {
                                fs.write(path.join(src, 'packager.json'), packagerJson);

                                if (error) {
                                    this.error(error);
                                    if (stderr) {
                                        this.error(stderr);
                                    }
                                }
                                else {
                                    if (stdout) {
                                        this.info(stdout);
                                    }

                                    if (stderr) {
                                        this.info(stderr);
                                    }
                                }
                            }.bind(this));
                        }
                    }
                }.bind(this, destinationFile, file, asset));
            }, this);

        }.bind(this));
    }
});
