

var DataApi = {
    getNow         : function() {
        return Date.now();
    },
    getUsers       : function() {
        var userFile = 'data/users.json',
            fileData = fs.readFile(userFile);

        return Json.decode(fileData);
    },
    getWaitingList : function(askingUser) {
        var users = this.getUsers(),
            waitingList = [],
            waitingStatus = 'waiting',
            askingUserEmail = askingUser.email,
            user;

        console.log('askingUserEmail ' + askingUserEmail);

        for (var i = 0; i < users.length; i++) {
            user = users[i];
            if (user.status == waitingStatus && user.email != askingUserEmail) {
                console.log('user ' + user.email + ' ' + user.name)
                waitingList.push(user);
            }
        }

        return waitingList;
    },
    findUser       : function(userObj) {
        var users = this.getUsers(),
            currentTime = this.getNow(),
            user,
            found;

        for (var i = 0; i < users.length; i++) {
            user = users[i];
            if (!found && (user.name == userObj.name && user.email == userObj.email)) {
                found = user;
            }
        }

        if (!found) {
            user = {
                email     : userObj.email,
                name      : userObj.name,
                status    : 'waiting',
                gameId    : currentTime,
                lastLogin : currentTime
            };
            users.push(user);
        }
        else {
            user.status = 'waiting';
            user.lastLogin = currentTime;
        }

        this.updateUsers(users);
        return user;
    },
    updateUsers    : function(users) {
        this.writeFile('data/users.json', users);
    },
    writeFile      : function(file, data) {
        if (typeof data == 'object') {
            data = Json.encode(data);
        }
        fs.writeFile(file, data)
    }
};
