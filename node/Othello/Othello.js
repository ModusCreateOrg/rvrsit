var Othello = function(socket) {

    var app = function() {
        console.log("Othello instantiated");

        this.hi = function() {
            console.log('Oh yeah!');
        }
    };

    return new app();
}();

exports.Othello = Othello;