function otherId(game) {
    return game.currentTurn[ game.currentTurn[0] === Meteor.userId() ? 1 : 0 ];
}

Template.gameList.helpers({
    games: function () {
        return Games.find({ inProgress: true}).map(function (game) {
            game.otherPlayer = Meteor.users.findOne(otherId(game)).username;
            game.started = moment(game.started).fromNow();
            return game;
        });
    },

    completedGames: function () {
        return Games.find({ inProgress: false}).map(function (game) {
            game.otherPlayer = Meteor.users.findOne(otherId(game)).username;
            game.finished = moment(game.finished).fromNow();

            if(game.winner === 'tie') {
                game.message = "tied";
                game.labelType = "warning";
            }
            else if(game.winner === Meteor.userId()) {
                game.message = "won";
                game.labelType = "success";
            }
            else {
                game.message = "lost";
                game.labelType = "danger";
            }
            return game;
        });
    }
});

Template.userList.helpers({
    users: function () {
        var myId = Meteor.userId();
        var cantPlayAgainst = [myId];

        Games.find({inProgress: true}).forEach(function (game) {
            cantPlayAgainst.push(otherId(game));
        });
        return Meteor.users.find({ _id: { $not: { $in: cantPlayAgainst }}});
    }
});

Template.userItem.events({
    'click button': function (evt, template) {
        Meteor.call('createGame', template.data._id);
    }
});
