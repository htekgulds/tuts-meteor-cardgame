/**
 * Created by 61387399590 on 6/19/2015.
 */
takeComputerTurn = function (gameId) {
    var game = Games.findOne(gameId),
        id = Meteor.users.findOne({ username: 'computer' })._id,
        hand = game.players[id].hand,
        matches = [];

    // Find best matches for all cards in hand
    hand.forEach(function (card) {
        var cardMatches = Turns.findMatches(card, game.table),
            // if bestMatcch returns null set it to empty array
            match = Turns.bestMatch(cardMatches) || [];
        matches.push(match);
    });

    // Then find best match from all these best matches we found above
    var bestMatch = Turns.bestMatch(matches);

    var cardToPlay;
    if(bestMatch) {
        // If we have a match, we find that card with the
        // index of it in mnatches which is the same as the hand
        cardToPlay = hand[matches.indexOf(bestMatch)];
    }
    else {
        // else we play the card with the lowest value
        cardToPlay = hand.sort(function (a, b) {
            return a.value - b.value;
        })[0];
    }

    Meteor.call('takeTurn', gameId, id, cardToPlay);
};