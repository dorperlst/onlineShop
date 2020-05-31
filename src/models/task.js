const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task

















<!DOCTYPE html>
  
<html>

<head>
    
    <link rel="stylesheet" href="/css/styles.css">
    <link rel="icon" href="/img/weather.png">

</head>
 <title><%= title %></title> 
 
 

<body>
<div class="wrapper">
    <div class="main">
      <div class="rowwrapper">
        <div  class="main2">
          <div id = "popup" style="display: none;" class="container">  
            <form id="contact" action="" method="post">
              <h3>Colorlib Contact Form</h3>
              <h4>Product Name</h4>
              
              <fieldset>
                <input placeholder="Your name" id="productname" name="productname" type="text" tabindex="1" required autofocus>
                <input  id="price" name="price" placeholder="Product Price" type="text" tabindex="2" required>

              </fieldset>
              <h4>Product Price</h4>
              <fieldset>
              </fieldset>

            
              <h4>Product Description</h4>

              <fieldset>
                <textarea id ="description" name="description" placeholder="Product Description...." tabindex="5" required></textarea>
              </fieldset>

              <fieldset>
                <a onclick="addAttributes()"> Add Attributes</a> 
                <ul id = "attributes"></ul>
              </fieldset>

              <fieldset>
                <a onclick="addDetails()"> Add Details</a> 
                <ul id = "details"></ul>
              </fieldset>

              <fieldset>
                <a onclick="addTags()"> Add Tags</a> 
                <ul id = "tags"></ul>
              </fieldset>

              <fieldset>
                <ul id = "images"></ul>
              </fieldset>
              
              <fieldset>
                Select images: <input type="file" onchange="loadImageFileAsURL()" id="productFiles" name="myFiles" multiple>
              </fieldset>
              
              <fieldset>
                <ul id = "images"></ul>
              </fieldset>
              
               
            

              <fieldset>
                <button name="submit" type="submit" id="contact-submit" data-submit="...Sending">Submit</button>
              </fieldset>
              <fieldset>
                <select id="formcategories" name="category">
                  <% categories.forEach(function(category) { %>
                    <option value="<%= category._id %>"><%= category.name %></li>
                  <% }); %>
                </select>
              </fieldset>
              
              <input type="hidden" value = "" id="id"  name="id">

              

              <!-- <p class="copyright">Designed by <a href="https://colorlib.com" target="_blank" title="Colorlib">Colorlib</a></p> -->
            </form>


            <div id ="fileDiv"></div>

          </div>
          <div>
              <div id="productsDiv" class="blue grid-wrapper"> 
                
                <% products.forEach(function(product) { %>
                     <div class ="box zone "> 
                        <%  if ( product.images[0]) { %> <img  class="" src="../../uploads/<%= product.images[0] %>"></img> <% }
                            else  { %>  <img  class="" src="../../uploads/default.jpeg"></img> <% }  %>
                        <p><%= product.name %></p>
                        <p><%= product.description %></p>
                        <p><%= product.price %> $</p>
                        <a onclick="editProduct('<%= product._id %>')">Edit</a> 
                        <a onclick="deleteProduct('<%= product._id %>')">Delete</a> 
                      </div>
                <% }); %>
              </div>
           
              
              


        </div>
      </div>
      <aside class="aside2 aside-1">  
          
          <%- include('../partials/categories.ejs') %>
      </aside>
     </div> 
  </div>
  <aside class="aside header">
    <%- include('../partials/search.ejs') %>

   </aside>
  <aside class="aside footer">
    <%- include('../partials/footer.ejs') %>
  </aside>
</div>

<input type="hidden" value ='<%= shopname %>' id=shopname>
<script src="/js/admin.js"></script>

</body>