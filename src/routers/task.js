// var express = require('express');
// var bodyParser = require('body-parser');
// const router = new express.Router()
// var port = 8000;
// var multer = require('multer'); // v1.0.5
// var storage =   multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, './uploads');
//   },
//   filename: function (req, file, callback) {
//     callback(null, file.originalname.substring(0,file.originalname.lastIndexOf('.')) + '-' + Date.now() + file.originalname.substring(file.originalname.lastIndexOf('.'),file.originalname.length));
//   }
// });
// var upload = multer({ storage : storage}).array('myFiles', 12);

// // router.use(bodyParser.json());
// // router.use(bodyParser.urlencoded({extended: true}));

// // router.post('/api/upload',function(req,res){
// //     console.log('req.body9999999999999999999');
// //     multer({ storage : storage}).array('myFiles', 12)(req,res,function(err) {
// //         if(err) {
// //             return res.end("Error uploading file.");
// //         }
// //         res.end("File is uploaded"); 
// //         console.log(req.body);
// //     });
// // });

// module.exports = router

// body {
//   margin: 0 auto;
//   background: #fff;
//   color :rgb(17, 17, 17);
//   display: flex;
//   min-height: 100vh;
//   flex-direction: column;
// }

// .main{
//   flex: 1;    /* same as flex-grow: 1; */
// }
// .images {
//   display: flex;
//   flex-wrap: wrap;
//   margin: -20px;
// }

// .imagewrapper {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: calc(50% - 20px);
//   height: 300px;
//   margin: 10px;
// }

// .image {
//   display: block;
//   object-fit: cover;
//   width: 100%;
//   height: 80%; /* set to 'auto' in IE11 to avoid distortions */
// }
// .zone {
//   /* FONT-WEIGHT: 100; */
//   /* padding:30px 50px; */
//   /* cursor:pointer; */
//   /* color:#FFF; */
//   /* font-size:2em; */
//   /* border-radius:4px; */
//   /* border:1px solid #bbb; */
//   /* transition: all 0.3s linear; */
// }

// .zone:hover {
//   -webkit-box-shadow:rgba(0,0,0,0.8) 0px 5px 15px, inset rgba(0,0,0,0.15) 0px -10px 20px;
//   -moz-box-shadow:rgba(0,0,0,0.8) 0px 5px 15px, inset rgba(0,0,0,0.15) 0px -10px 20px;
//   -o-box-shadow:rgba(0,0,0,0.8) 0px 5px 15px, inset rgba(0,0,0,0.15) 0px -10px 20px;
//   box-shadow:rgba(0,0,0,0.8) 0px 5px 15px, inset rgba(0,0,0,0.15) 0px -10px 20px;
// }

// /***********************************************************************
// *  Nav Bar
// **********************************************************************/
// .main-nav {
//   display: flex;
//   list-style: none;
//   margin: 0;
//   /* font-size: 0.7em; */
// }

// @media only screen and (max-width: 600px) {
//   .main-nav {
//       font-size: 0.5em;
//       padding: 0;
//   }
// }

// .push {
//   margin-left: auto;
// }
// ul{ 
//      list-style: none;
// }
// li {
//   padding: 20px;
// }

// a {
//   color: rgb(226, 101, 43);
//   text-decoration: none;
// }
  

// /***********************************************************************
// *  Cover
// **********************************************************************/
// .container { 
//   /*show heigh: auto*/
//   /* height: 50vh; */
//   /* display: flex; */
//   /* align-items: center; */
//   /* justify-content: center; */
//   /* color:#FFF; */
//   /* font-size:2em; */
//   /* border-radius:4px; */
//   /* border:2px solid #bbb; */
//   transition: all 0.3s linear;
//   /* display: flex; */
// }

// /***********************************************************************
// *  Grid Panel
// **********************************************************************/
// .grid-wrapper {
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
//   grid-gap: 20px;
// }

// .box {
// /* margin-right: auto; */
// display: flex;
// /* flex-flow: row wrap; */
// /* background-color: #444; */
// /* justify-content: left; */
// /* margin-right: auto; */
// /* flex: 1; */
// /* flex-direction: column; */
// /* flex-flow: column wrap; */
// padding: 10px 5px 5px 10px  /* text-align: left;;;;;;;; */;
// /* border-radius: 10px; */
// }

// .imgbox{
//    /* justify-content: start; */
//    /* padding: 10px; */
//    /* align-items: flex-start; */  /* ADD THIS! */
// }

// .labelbox{
//   /* justify-content: end; */
//   /* justify-content: space-between; */
//   /* align-items: flex-start; */  /* ADD THIS! */
// }

// .box > span {
//   padding: 10px 0px 0px 10px
// }
// .box > a {
//   padding: 10px 0px 0px 10px

// }

// /***********************************************************************
// *  Footer
// **********************************************************************/
// footer {
//   display: flex;
//   /* min-height: 100vh; */
//   flex-direction: column;
//   text-align: center;
// }

// /*https://paulund.co.uk/how-to-create-shiny-css-buttons*/
// /***********************************************************************
// *  Green Background
// **********************************************************************/
// .green {
//   background: #56B870; /* Old browsers */
//   background: -moz-linear-gradient(top, #56B870 0%, #a5c956 100%); /* FF3.6+ */
//   background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#56B870), color-stop(100%,#a5c956)); /* Chrome,Safari4+ */
//   background: -webkit-linear-gradient(top, #56B870 0%,#a5c956 100%); /* Chrome10+,Safari5.1+ */
//   background: -o-linear-gradient(top, #56B870 0%,#a5c956 100%); /* Opera 11.10+ */
//   background: -ms-linear-gradient(top, #56B870 0%,#a5c956 100%); /* IE10+ */
//   background: linear-gradient(top, #56B870 0%,#a5c956 100%); /* W3C */
// }

// /***********************************************************************
// *  Red Background
// **********************************************************************/
// .red {
//   background: #C655BE; /* Old browsers */
//   background: -moz-linear-gradient(top, #C655BE 0%, #cf0404 100%); /* FF3.6+ */
//   background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#C655BE), color-stop(100%,#cf0404)); /* Chrome,Safari4+ */
//   background: -webkit-linear-gradient(top, #C655BE 0%,#cf0404 100%); /* Chrome10+,Safari5.1+ */
//   background: -o-linear-gradient(top, #C655BE 0%,#cf0404 100%); /* Opera 11.10+ */
//   background: -ms-linear-gradient(top, #C655BE 0%,#cf0404 100%); /* IE10+ */
//   background: linear-gradient(top, #C655BE 0%,#cf0404 100%); /* W3C */
// }

// /***********************************************************************
// *  Yellow Background
// **********************************************************************/
// .yellow {
//   background: #F3AAAA; /* Old browsers */
//   background: -moz-linear-gradient(top, #F3AAAA 0%, #febf04 100%); /* FF3.6+ */
//   background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#F3AAAA), color-stop(100%,#febf04)); /* Chrome,Safari4+ */
//   background: -webkit-linear-gradient(top, #F3AAAA 0%,#febf04 100%); /* Chrome10+,Safari5.1+ */
//   background: -o-linear-gradient(top, #F3AAAA 0%,#febf04 100%); /* Opera 11.10+ */
//   background: -ms-linear-gradient(top, #F3AAAA 0%,#febf04 100%); /* IE10+ */
//   background: linear-gradient(top, #F3AAAA 0%,#febf04 100%); /* W3C */
// }

// /***********************************************************************
// *  Blue Background
// **********************************************************************/
// .blue {
//   background: #fff; /* Old browsers */
//   background: -moz-linear-gradient(top, #7abcff 0%, #60abf8 44%, #4096ee 100%); /* FF3.6+ */
//   /* background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#7abcff), color-stop(44%,#60abf8), color-stop(100%,#4096ee)); */ /* Chrome,Safari4+ */
//   /* background: -webkit-linear-gradient(top, #7abcff 0%,#60abf8 44%,#4096ee 100%); */ /* Chrome10+,Safari5.1+ */
//   background: -o-linear-gradient(top, #7abcff 0%,#60abf8 44%,#4096ee 100%); /* Opera 11.10+ */
//   background: -ms-linear-gradient(top, #7abcff 0%,#60abf8 44%,#4096ee 100%); /* IE10+ */
//   background: linear-gradient(top, #7abcff 0%,#60abf8 44%,#4096ee 100%); /* W3C */
// }
{/* <span><%= product.name %></span>
<span><%= product.descrption %></span>
<span><%= product.price %> $</span>
<span><%= product.descrption %></span>

<span>  <a href = view/<%= product.descrption %> >details...</a> </span> */}



















 
// <%- include('../partials/header.ejs') %>

// <body>
//   <div class="wrapper">
//       <div class="main">
//         <div class="rowwrapper">
//           <div  class="main2">
//             <div>
//                 <div id="productsDiv" class="blue grid-wrapper"> 
                  
//                   <% products.forEach(function(product) { %>
//                        <div class ="box zone "> 
//                         <% 
//                         if ( product.images[0]) { %>
//                           <img  class="image" src="../../uploads/<%= product.images[0] %>"></img> 
//                         <% }
//                         else  { %>
//                           <img  class="image" src="../../uploads/default.jpeg"></img> 
//                         <% }
//                         %>
//                           <p><%= product.name %></p>
//                           <p><%= product.description %></p>
//                           <div>  
//                               <p><%= product.price %> $</p>
//                                 <a href="/<%=shopname %>/view/<%= product._id %>" >details... </a>
//                           </div>
//                        </div>
//                    <% }); %>
//                 </div>

//                 <!-- <div id="categoriesDiv" class="centered-form__box">
//                    <span> -----------------categories----------------</span>

//                     <% categories.forEach(function(category) { %>
//                         <div class ="box zone "> 
//                          <% 
//                          if ( category.image) { %>
//                            <img  class="image" src="../../uploads/<%= category.image %>"></img> 
//                          <% }
//                          else  { %>
//                            <img  class="image" src="../../uploads/default.jpeg"></img> 
//                          <% }
//                          %>
//                            <p><%= category.name %></p>
//                            <p><%= category.description %></p>
                            
//                         </div>
//                     <% }); %>




//                 </div> -->


//                 <div class="centered-form__box">
//                     <h1>Product</h1>
//                     <a onclick = addProduct() >Add Product</a>
//                     <form id= "form"  action="/"  method="post">
//                         <label>Product Name</label>
//                         <input type="text" value="" id="productname" name="productname" placeholder="Display Name" required>
    
//                         <select id="categories" name="category"></select>
    
//                         <label>Description</label>
//                         <textarea id ="description"    placeholder="description" name="description"    cols="40" rows="5" required></textarea>
//                         <label>Price</label>
//                         <input type="text" value = "" id="price"  name="price" placeholder="price" required>
                    
//                         <div id = "attributesDiv">     
//                             <a onclick="addAttributes()"> Add Attributes</a> 
//                             <ul id = "attributes"></ul>
//                         </div>
//                          <div id = "detailsDiv">     
//                             <a onclick="addDetails()"> Add Details</a> 
//                             <ul id = "details"></ul>
//                         </div>
//                          <div id = "tagsDiv">     
//                             <a onclick="addTags()"> Add Tags</a> 
//                             <ul id = "tags"></ul>
//                         </div>
//                         <input type="hidden" value = "" id="id"  name="id">
    
//                         Select images: <input type="file" id="productFiles" name="myFiles" multiple>
    
//                         <input type="submit" value="Submit">  
//                     </form>
    
//                     <input type="button" onclick = 'addCat()' value="add cat">  
    
//                 </div>

//           </div>
//         </div>
//         <aside class="aside2 aside-1">  <%- include('../partials/categories.ejs') %>
//         </aside>
//        </div> 
//     </div>
//     <aside class="aside header">
//       <%- include('../partials/search.ejs') %>
//     </aside>
//     <aside class="aside footer">
//       <%- include('../partials/footer.ejs') %>
//     </aside>
//   </div>

//   <script src="/js/admin.js"></script>
 
// </body>
      

 



// {{>header}}

// <body>
//     <div class="main-content">
//         {{>header}}

//           <div class="centered-form">

//             <div id="productsDiv" class="centered-form__box"></div>

//             <div id="categoriesDiv" class="centered-form__box"></div>

//             <div class="centered-form__box">
//                 <h1>Product</h1>
//                 <a onclick = addProduct() >Add Product</a>
//                 <form id= "form"  action="/"  method="post">
//                     <label>Product Name</label>
//                     <input type="text" value="" id="productname" name="productname" placeholder="Display Name" required>

//                     <select id="categories" name="category"></select>

//                     <label>Description</label>
//                     <textarea id ="description"    placeholder="description" name="description"    cols="40" rows="5" required></textarea>
//                     <label>Price</label>
//                     <input type="text" value = "" id="price"  name="price" placeholder="price" required>
                
//                     <div id = "attributesDiv">     
//                         <a onclick="addAttributes()"> Add Attributes</a> 
//                         <ul id = "attributes"></ul>
//                     </div>
//                      <div id = "detailsDiv">     
//                         <a onclick="addDetails()"> Add Details</a> 
//                         <ul id = "details"></ul>
//                     </div>
//                      <div id = "tagsDiv">     
//                         <a onclick="addTags()"> Add Tags</a> 
//                         <ul id = "tags"></ul>
//                     </div>
//                     <input type="hidden" value = "" id="id"  name="id">

//                     Select images: <input type="file" id="productFiles" name="myFiles" multiple>

//                     <input type="submit" value="Submit">  
//                 </form>

//                 <input type="button" onclick = 'addCat()' value="add cat">  

//             </div>
//         </div>
//     </div>

//     {{>footer}}

//     <script src="/js/admin.js"></script>
// </body>

// </html>