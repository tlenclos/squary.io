Template.controls.rendered = function() {
    $("#picker").spectrum({
        clickoutFiresChange: true,
        showInput: true,
        showInitial: true,
        showAlpha: true,
        showButtons: false,
        preferredFormat: "hex",
        replacerClassName: 'tool-color',
        move: function(tinycolor) {
            var rgb = tinycolor.toRgb();

            if (Tools.getContrastForRgb(rgb) > 125) {
                $('.sp-preview-inner').css('color', 'black');
                $('#save-color').css('color', 'black');
            } else {
                $('.sp-preview-inner').css('color', 'white');
                $('#save-color').css('color', 'white');
            }

            $('#save-color').css('background-color', tinycolor.toHexString());
        }
    });
    $('.sp-preview-inner').html('<i class="fa fa-tint"></i><br />Color');
};

Template.controls.helpers({
    ownBoard: function() {
        return this.userId === Meteor.userId();
    },
    drawers: function () {
        return UserConnections.find().count();
    },
    owner: function() {
        var user = Meteor.users.findOne({_id: this.userId});
        return user ? user.profile.name : false;
    },
    message: function() {
        return Session.get('message');
    },
    colors: function() {
        return ColorsCollections.find();
    }
});

Template.controls.setStateDeleteForSavedColor = function($color, deleteState) {
  if (deleteState) {
      $color.addClass('show-color-delete');
      $color.text('x');
      $color.css('color', Tools.getTextColorForRgb($color.css('background-color')));
  } else {
      $color.removeClass('show-color-delete');
      $color.text('');
  }
};

Template.controls.events({
    // Title
    'click #board-title': function(event, context) {
        // Make title editable on click
        var titleDom = event.currentTarget;
        var title = $(event.currentTarget);
        title.attr('contenteditable', true);
        title.trigger('focus');

        // Set selection
        var sel = window.getSelection();
        sel.collapse(titleDom.firstChild, title.text().length);

        // Display save button
        $('#board-title-save').css('display', 'block');
    },
    'blur #board-title': function(event, context) {
        var title = $(event.currentTarget);
        title.attr('contenteditable', false);
        BoardsCollections.update(context.data._id, {$set:{title: title.text()}});

        // Hide save button
        $('#board-title-save').css('display', 'none');
    },
    'click #board-title-save': function(event, context) {
        event.preventDefault();
        event.target.style.display = 'none';
        var title = $('#board-title').text()
        BoardsCollections.update(context.data._id, {$set:{title: title}});
    },

    // Colors
    'click #save-color': function(event, context) {
        event.preventDefault();
        Meteor.call('addColor', Squary.board.boardId, event.target.style.backgroundColor);
    },
    'click .color-bubble': function(event, context) {
        event.preventDefault();
        if (event.target.classList.contains('show-color-delete')) {
            return;
        }

        Squary.board.setColorForPicker(event.target.style.backgroundColor);
    },
    'mouseover .color-bubble':  function(event, context) {
        var id = event.target.dataset.id;
        Session.set('savedColorOver', event.target.dataset.id);

        setTimeout(function() {
            if (id === Session.get('savedColorOver')) {
                Template.controls.setStateDeleteForSavedColor($(event.target), true);
            }
        }, 2500);
    },
    'mouseout .color-bubble':  function(event, context) {
        Session.set('savedColorOver', null);
        Template.controls.setStateDeleteForSavedColor($(event.target), false);
    },
    'click .show-color-delete': function(event, context) {
        event.preventDefault();
        Meteor.call('removeColor', Squary.board.boardId, event.target.dataset.id);
    },

    // Links
    'click #link-delete-board': function(event, context) {
        event.preventDefault();

        var deleteConfirmed = confirm('Are you sure to delete the board "'+context.data.title+'"');
        if (deleteConfirmed) {
            Meteor.call('deleteBoard', context.data._id);
            Router.go('boardsList');
        }
    },
    'click #link-download-board': function(event, context) {
        event.preventDefault();

        // TODO capture canvas OR download full image rendered
        alert("Sorry this feature is not implemented yet");
    }
});
