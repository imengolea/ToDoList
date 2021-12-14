const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/todolistDB');

const itemsSchema ={
  name: String
};

const Item = mongoose.model('Item', itemsSchema)

const item = new Item({
  name: 'buy milk'
})

const item1 = new Item({
  name: 'study react'
})

const item2 = new Item({
  name: 'make my app'
})

const defaultItems = [item, item1, item2]

//list Schema

const listsSchema ={
  name: String,
  items:[itemsSchema]
};

const List = mongoose.model('List', listsSchema)




app.get('/', function(req, res) {

  Item.find({}, function(error, items){

    if(items.length === 0){
      Item.insertMany(defaultItems, function(error){
        if(error){
          console.log(error);
        }else{
          console.log('success');
        }
      })
      res.redirect('/');
    }else{
      res.render('list', {
        listTitle: 'Today',
        newListItem: items
      });
    }
  })
});


app.post('/', function(req, res) {
  const itemName = req.body.listItem;
  const listName = req.body.list;

 const itemList = new Item ({
   name: itemName
 })

 if(listName === 'today'){
   itemList.save();
     res.redirect('/')
 }else{
   List.findOne({name: listName}, function(err, foundList){
     foundList.items.push(itemList);
     foundList.save();
     res.redirect('/' + listName)
   })
 }


})


app.post('/delete', function(req,res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === 'today'){
    Item.findByIdAndRemove({_id:checkedItemId}, function(err){
      if(err){
        console.log(err);
      }else{
        console.log('delete checked Item Id');
          res.redirect('/')
      }
    })
  }else{
    
  }



})


app.get('/:costumList', function(req, res){
  const cosutumListName = req.params.costumList;

List.findOne({name:cosutumListName}, function(err, foundList){
  if(!err ){
    if(!foundList){
     //create new list
      const list = new List({
        name: cosutumListName,
        items: defaultItems
      })
      list.save()
      res.redirect('/' + cosutumListName)
    }else{
      res.render('list', {listTitle: foundList.name, newListItem: foundList.items})
    }
  }
})



})

app.get('/work', function(req, res) {

  res.render('list', {
    listTitle: 'work list',
    newListItem: workItems
  })
});

app.post('/work', function(req, res) {
  const item = req.body.listItem;
  workItems.push(item);
  res.redirect('/work')

})

app.get('/about', function(req, res) {
  res.render('about');
})







app.listen(3000, function() {
  console.log('server run on port 3000');
});
