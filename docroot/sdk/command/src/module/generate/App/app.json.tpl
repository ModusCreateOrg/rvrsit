{
    "js": [
        {
            "shared": "http://touch-{sdkShortVersion}.senchacdn.com/touch/{sdkVersion}/",
            "path": "sdk/sencha-touch<tpl if="library == 'all'">-all</tpl>.js"
        {[ "\}"]},
        {
            "path": "app.js",
            "update": "delta"
        {[ "\}"]}
    ],
    "css": [
        {
            "path": "resources/css/app.css",
            "update": "delta"
        {[ "\}"]}
    ],
    "appCache": {
        "cache": [
            "index.html"
        ],
        "network": [
            "*"
        ],
        "fallback": []
    {[ "\}"]},
    "extras": [
        "resources/images"
    ],
    "buildPath": {
        "testing": "build/testing",
        "production": "build/production",
        "native": "build/native"
    {[ "\}"]},
    "archivePath": "archive",
    "preprocessor": {
        "product": "touch",
        "minVersion": 3,
        "debug": false,
        "logger": "no"
    {[ "\}"]}
{[ "\}"]}
