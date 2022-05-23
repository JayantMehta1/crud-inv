const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Item = mongoose.model('Item');
const Recent = mongoose.model('Recent');

// const Recent = mongoose.model('Recent');


router.get('/', (req, res) => {
    res.render("item/addOrEdit", {
        viewTitle: "Insert Item"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var item = new Item();
    item.name = req.body.name;
    item.quantity = req.body.quantity;
    item.comments = req.body.comments;
    item.save((err, doc) => {
        if (!err)
            res.redirect('item/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("item/addOrEdit", {
                    viewTitle: "Insert Item",
                    item: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Item.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('item/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("item/addOrEdit", {
                    viewTitle: 'Update Item',
                    item: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Item.find((err, docs) => {
        if (!err) {
            res.render("item/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving item list :' + err);
        }
    });
});

router.get('/deleted/list', (req, res) => {
    Recent.find((err, docs) => {
        if (!err) {
            res.render("item/deletedlist", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving deleted item list :' + err);
        }
    });
});




function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'name':
                body['nameError'] = err.errors[field].message;
                break;
            case 'quantity':
                body['quantityError '] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Item.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("item/addOrEdit", {
                viewTitle: "Update Item",
                item: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Item.findById(req.params.id, (error, data) => {
        if(error){
            console.log(error)
        } else {
            console.log(data.name)
            Recent.create({
                name: data.name,
                quantity: data.quantity,
                comments: data.comments
            }).then((ans) => {
                console.log("Document inserted")
            }).catch((err) => {
                console.log(err.Message);
            })
        }
    })

    Item.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/item/list');
        }
        else { console.log('Error in item delete :' + err); }
    });
});

router.get('/restore/:id', (req, res) => {
    Recent.findById(req.params.id, (error, data) => {
        if(error){
            console.log(error)
        } else {
            console.log(data.name)
            Item.create({
                name: data.name,
                quantity: data.quantity,
                comments: data.comments
            }).then((ans) => {
                console.log("Document inserted")
            }).catch((err) => {
                console.log(err.Message);
            })
        }
    })

    Recent.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/item/list');
        }
        else { console.log('Error in item delete :' + err); }
    });
});

module.exports = router;