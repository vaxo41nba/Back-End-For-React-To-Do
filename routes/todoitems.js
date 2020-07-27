const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

let { Item } = require('../models/items'); 

router.get('/:username', (req, res) => {
  Item.find({ user: req.params.username })
  .then(doc => {
    res.send(doc);
  })
  .catch(err => {
    res.send(err); 
  })
});

router.post('/add', (req, res) => { 
  if (Object.keys(req.body).length > 0) {
  let toDoList = new Item(req.body);
  toDoList.save()
    .then(doc => {
      res.send(doc);
    })
    .catch(err => {
      res.send(err); 
    });
  } else {
    res.send("please fill in the body");
  } 
});

router.put('/edit/:todoid', (req, res) => { 
  Item.updateOne({ _id: req.params.todoid }, req.body)
  .then(doc => {
    res.send(doc);
  })
  .catch(err => {
    res.send(err);
  });
});

router.put('/selectAll', (req, res) => { 
 Item.updateMany({checked: false}, {checked: true})
  .then(doc => {
    res.send(doc);
  })
  .catch(err => {
    res.send(err);
  });
});

router.put('/unSelectAll', (req, res) => { 
  Item.updateMany({checked: true}, {checked: false})
  .then(doc => {
    res.send(doc);
  })
  .catch(err => {
    res.send(err);
  });
});

router.delete('/delete/:todoid', (req, res) => {
  Item.deleteOne({ _id: req.params.todoid })
  .then(doc => {
    res.send(doc);
  })
  .catch(err => {
    res.send(err);
  });
});

router.delete('/deleteSelected', (req, res) => {
  Item.deleteMany({checked: true})
  .then(doc => {
    res.send(doc);
  })
  .catch(err => {
    res.send(err);
  });
});

module.exports = router;