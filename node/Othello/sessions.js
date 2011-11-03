exports.sessions = {
    addSession: function(data, cb, scope) {
        var db = this.getDb(),
            session;

        scope = scope || this;
        
        session = new db.Session(this.apply({
            state : 2
        }, data));

        session.save(this.bind(cb, scope));
    },

    getSession: function(id, cb, scope) {
        var db      = this.getDb(),
            session  = db.Session;

        scope = scope || this;

        session.findById(id, this.bind(cb, scope));
    },

    listSessions: function(query, cb, scope) {
        var db      = this.getDb(),
            session  = db.Session;

        scope = scope || this;

        session.find(query, this.bind(cb, scope));
    }
};