// // const mongoose = require('mongoose')

// // const taskSchema = new mongoose.Schema({
// //     description: {
// //         type: String,
// //         required: true,
// //         trim: true
// //     },
// //     completed: {
// //         type: Boolean,
// //         default: false
// //     },
// //     owner: {
// //         type: mongoose.Schema.Types.ObjectId,
// //         required: true,
// //         ref: 'User'
// //     }
// // }, {
// //     timestamps: true
// // })

// // const Task = mongoose.model('Task', taskSchema)

// // module.exports = Task

















// // <!DOCTYPE html>
  
// // <html>

// // <head>
    
// //     <link rel="stylesheet" href="/css/styles.css">
// //     <link rel="icon" href="/img/weather.png">

// // </head>
// //  <title><%= title %></title> 
 
 

// // <body>
// // <div class="wrapper">
// //     <div class="main">
// //       <div class="rowwrapper">
// //         <div  class="main2">
// //           <div id = "popup" style="display: none;" class="container">  
// //             <form id="contact" action="" method="post">
// //               <h3>Colorlib Contact Form</h3>
// //               <h4>Product Name</h4>
              
// //               <fieldset>
// //                 <input placeholder="Your name" id="productname" name="productname" type="text" tabindex="1" required autofocus>
// //                 <input  id="price" name="price" placeholder="Product Price" type="text" tabindex="2" required>

// //               </fieldset>
// //               <h4>Product Price</h4>
// //               <fieldset>
// //               </fieldset>

            
// //               <h4>Product Description</h4>

// //               <fieldset>
// //                 <textarea id ="description" name="description" placeholder="Product Description...." tabindex="5" required></textarea>
// //               </fieldset>

// //               <fieldset>
// //                 <a onclick="addAttributes()"> Add Attributes</a> 
// //                 <ul id = "attributes"></ul>
// //               </fieldset>

// //               <fieldset>
// //                 <a onclick="addDetails()"> Add Details</a> 
// //                 <ul id = "details"></ul>
// //               </fieldset>

// //               <fieldset>
// //                 <a onclick="addTags()"> Add Tags</a> 
// //                 <ul id = "tags"></ul>
// //               </fieldset>

// //               <fieldset>
// //                 <ul id = "images"></ul>
// //               </fieldset>
              
// //               <fieldset>
// //                 Select images: <input type="file" onchange="loadImageFileAsURL()" id="productFiles" name="myFiles" multiple>
// //               </fieldset>
              
// //               <fieldset>
// //                 <ul id = "images"></ul>
// //               </fieldset>
              
               
            

// //               <fieldset>
// //                 <button name="submit" type="submit" id="contact-submit" data-submit="...Sending">Submit</button>
// //               </fieldset>
// //               <fieldset>
// //                 <select id="formcategories" name="category">
// //                   <% categories.forEach(function(category) { %>
// //                     <option value="<%= category._id %>"><%= category.name %></li>
// //                   <% }); %>
// //                 </select>
// //               </fieldset>
              
// //               <input type="hidden" value = "" id="id"  name="id">

              

// //               <!-- <p class="copyright">Designed by <a href="https://colorlib.com" target="_blank" title="Colorlib">Colorlib</a></p> -->
// //             </form>


// //             <div id ="fileDiv"></div>

// //           </div>
// //           <div>
// //               <div id="productsDiv" class="blue grid-wrapper"> 
                
// //                 <% products.forEach(function(product) { %>
// //                      <div class ="box zone "> 
// //                         <%  if ( product.images[0]) { %> <img  class="" src="../../uploads/<%= product.images[0] %>"></img> <% }
// //                             else  { %>  <img  class="" src="../../uploads/default.jpeg"></img> <% }  %>
// //                         <p><%= product.name %></p>
// //                         <p><%= product.description %></p>
// //                         <p><%= product.price %> $</p>
// //                         <a onclick="editProduct('<%= product._id %>')">Edit</a> 
// //                         <a onclick="deleteProduct('<%= product._id %>')">Delete</a> 
// //                       </div>
// //                 <% }); %>
// //               </div>
           
              
              


// //         </div>
// //       </div>
// //       <aside class="aside2 aside-1">  
          
// //           <%- include('../partials/categories.ejs') %>
// //       </aside>
// //      </div> 
// //   </div>
// //   <aside class="aside header">
// //     <%- include('../partials/search.ejs') %>

// //    </aside>
// //   <aside class="aside footer">
// //     <%- include('../partials/footer.ejs') %>
// //   </aside>
// // </div>

// // <input type="hidden" value ='<%= shopname %>' id=shopname>
// // <script src="/js/admin.js"></script>

// // </body>



 
// .wrapper {
//   height: inherit;
//   display: flex;
//   flex-flow: column;
//   /* font-weight: bold; */
//   /* text-align: center; */
//   /* overflow: scroll; */
// }
 


// .rowwrapper {
//     height: inherit;
//     display: flex;
//     flex-flow: row wrap;
//     font-weight: bold;
//     text-align: center;
//   }
  
// .main2 {
//     text-align: left;
//     flex: 5 0 0;
//     height: inherit;
//     /* overflow: scroll; */
//   }
  
// .main {
//   text-align: left;
//   height: inherit;
// }
// .footer {
//   text-align: center;
//  }
// .aside-1 {
//    /* background: radial-gradient(#0000002e, transparent); */
//    }
 
// .header {
//   background: radial-gradient(#0000002e, transparent);
//   FONT-WEIGHT: 150;
//   font-size:1em;
// }

 
 

// @media all   {
//   .aside {flex: 1 0 0;}
//   .aside2 {flex: 1 0 0;}
//   .header {order: 1;} 
//   .main    {overflow: scroll;order: 2;}
//   .footer  { order: 3; }
//   .aside-1  { order: 1; } 
//   .aside-2  { order: 3; } 
//   .main2   { order: 2; }

// }



 
// body {
//     height: 100%;
//     margin: 0;
//     background: radial-gradient(#0000002e, transparent);

// }

// .zone {
//     FONT-WEIGHT: 50;
//     /* padding: 10 10 10 10; */
//     /* cursor:pointer; */
//     /* color:#FFF; */
//     /* border-radius:4px; */
//     /* border:1px solid #bbb; */
//     transition: all 0.3s linear;
//   }
  
//   .zone:hover {
//     -webkit-box-shadow:rgba(0,0,0,0.8) 0px 5px 15px, inset rgba(0,0,0,0.15) 0px -10px 20px;
//     -moz-box-shadow:rgba(0,0,0,0.8) 0px 5px 15px, inset rgba(0,0,0,0.15) 0px -10px 20px;
//     -o-box-shadow:rgba(0,0,0,0.8) 0px 5px 15px, inset rgba(0,0,0,0.15) 0px -10px 20px;
//     box-shadow:rgba(0,0,0,0.8) 0px 5px 15px, inset rgba(0,0,0,0.15) 0px -10px 20px;
// }


// /***********************************************************************
//  *  Nav Bar
//  **********************************************************************/
//  .main-nav {
//     display: flex;
//     list-style: none;
//     margin: 0;
//     font-size: 1.2em;
// }

// @media only screen and (max-width: 600px) {
//     .main-nav {
//         font-size: 0.5em;
//         padding: 0;
//     }
// }

// .push {
//     margin-left: auto;
// }
// ul {
//   list-style: none;
//   margin: 0;
//   padding: 0;
//   font-size: 1.2em;
//   }
// li {
//     /* max-height: 20px; */
//     padding: 10 20 10 20;
// }

// a {
//     cursor: pointer;
//     /* color: #f5f5f6; */
//     text-decoration: none;
// }

 

// /***********************************************************************
// *  Grid Panel
// **********************************************************************/
// .grid-wrapper {
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
//   /* grid-gap: 5px; */
// }

// .box {
//      /* max-height: 50px; */
//      /* color: #FFF; */
//      border-radius:4px;
//      border-right: 1px solid #bbb;
//      padding: 10px;
//  }

// .box > img {
//   object-fit: contain;
//   /* width: 100%; */
//   height: 50px;
//   height: inherit;
// }

// .product
// {
//   /* width: 100%; */
// }


// @import url(https://fonts.googleapis.com/css?family=Roboto:400,300,600,400italic);
// * {
//   margin: 0;
//   padding: 0;
//   box-sizing: border-box;
//   -webkit-box-sizing: border-box;
//   -moz-box-sizing: border-box;
//   -webkit-font-smoothing: antialiased;
//   -moz-font-smoothing: antialiased;
//   -o-font-smoothing: antialiased;
//   font-smoothing: antialiased;
//   text-rendering: optimizeLegibility;
// }

// body {
//   font-family: "Roboto", Helvetica, Arial, sans-serif;
//   color: black;
//  }

// .container {
//   /* height: unset; */
//   /* max-width: 400px; */
//   /* width: 100%; */
//   /* margin: 0 auto; */
//   /* z-index: 10; */
//   /* position: absolute; */
//   /* left: 0px; */
//   /* top: 0px; */
// }
// #images > li {
//   padding: 0px;
//   margin: 0px;
// }


// #contact input[type="text"],
// #contact textarea,
// #contact button[type="submit"] {
//   font: 400 12px/16px "Roboto", Helvetica, Arial, sans-serif;
// }

// #contact textarea
// {
//    /* max-height: 25px; */
// }

// #contact {
//   width: 100%;
//   /* background: #F9F9F9; */
//   padding: 25px;
//   /* margin: 15px 0; */
//   box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
// }

// #contact h3 {
//   display: block;
//   font-size: 30px;
//   font-weight: 300;
//   margin-bottom: 10px;
// }

// #contact h4 {
//   margin: 5px 0 15px;
//   /* display: block; */
//   font-size: 13px;
//   font-weight: 400;
// }

// fieldset {
//   /* display: flex; */
//   border: medium none !important;
//   margin: 0 0 10px;
//   /* min-width: 100%; */
//   /* padding: 0; */
//   /* width: 100%; */
// }

// #contact input[type="text"],
//  #contact textarea {
//   width: 100%;
//   border: 1px solid #ccc;
//   /* background: #FFF; */
//   margin: 0 0 5px;
//   padding: 7px;
// }

// #contact input[type="text"]:hover,
 
// #contact textarea:hover {
//   -webkit-transition: border-color 0.3s ease-in-out;
//   -moz-transition: border-color 0.3s ease-in-out;
//   transition: border-color 0.3s ease-in-out;
//   border: 1px solid #aaa;
// }

// #contact textarea {
//   height: 100px;
//   width: 100%;
//   resize: none;
// }

// #contact button[type="submit"] {
//   cursor: pointer;
//   width: 100%;
//   border: none;
//   background: #4CAF50;
//   color: #FFF;
//   margin: 0 0 5px;
//   padding: 10px;
//   font-size: 15px;
// }

// #contact button[type="submit"]:hover {
//   background: #43A047;
//   -webkit-transition: background 0.3s ease-in-out;
//   -moz-transition: background 0.3s ease-in-out;
//   transition: background-color 0.3s ease-in-out;
// }

// #contact button[type="submit"]:active {
//   box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5);
// }

// .copyright {
//   text-align: center;
// }

// #contact input:focus,
// #contact textarea:focus {
//   outline: 0;
//   border: 1px solid #aaa;
// }

// ::-webkit-input-placeholder {
//   color: #888;
// }

// :-moz-placeholder {
//   color: #888;
// }

// ::-moz-placeholder {
//   color: #888;
// }

// :-ms-input-placeholder {
//   color: #888;
// }
// .details >ul  {
//   list-style: inside;
// }