Schema.add({
    name       : 'Players',
    primaryKey : 'playerId',
    fields     : [
        { name : 'playerId', type : 'int', autoIncrement : true },
        { name : 'name', type : 'varchar', size : 128 },
        { name : 'email', type : 'varchar', size : 128 },
        { name : 'wins', type : 'int' },
        { name : 'losses', type : 'int'}
    ],
    indexes    : [
        'email',
        'name'
    ]
});

Schema.add({
    name       : 'Games',
    primaryKey : 'gameId',
    fields     : [
        { name : 'gameId', type : 'int', autoIncrement : true },
        { name : 'gameToken', type : 'varchar', size : 128 },
        { name : 'lastUpdate', type : 'int'},
        { name : 'currentPlayer', type : 'int' },
        { name : 'data', type : 'longtext'},
        { name : 'status', type : 'int' },
        { name : 'firstPlayerId', type : 'int' },
        { name : 'secondPlayerId', type : 'int' },
        { name : 'winner', type : 'int'}
    ],
    indexes    : [
        'gameId',
        'gameToken',
        'firstPlayerId',
        'secondPlayerId'
    ]
});

Schema.add({
    name       : 'PlayerSessions',
    primaryKey : 'cookie',
    engine     : 'memory',
    fields     : [
        { name : 'playerId', type : 'int' },
        { name : 'cookie', type : 'varchar', size : 32 },
        { name : 'state', type : 'int' },
        { name : 'loginTime', type : 'int' },
        { name : 'lastActivity', type : 'int' },
        { name : 'gameId', type : 'int' }
    ]
});

Schema.add({
    name       : 'Messages',
    primaryKey : 'messageId',
    engine     : 'memory',
    fields     : [
        {
            name          : 'messageId',
            type          : 'int',
            autoIncrement : true
        },
        {
            name : 'playerId',
            type : 'int'
        },
        {
            name : 'message',
            type : 'longtext'
        },
        {
            name : 'messageDate',
            type : 'int'
        },
        {
            name : 'messageType',
            type : 'varchar',
            size : 128
        }
    ]
});