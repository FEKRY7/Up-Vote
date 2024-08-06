const express = require('express');

const userRouter = require('./src/modules/auth/auth.routes.js')
const ProductRouter = require('./src/modules/product/product.routes.js')
const LikeRouter = require('./src/modules/like/like.routes.js')
const CommentRouter = require('./src/modules/comment/comment.routes.js')

const mongoConnection = require('./Database/dbConnection.js');
const dotenv = require('dotenv');
const cors = require('cors');
  

dotenv.config()
const app = express()
mongoConnection();
app.use(cors())
app.use(express.json()); // Parse request bodies as JSON



  


// Routes
app.use('/api/User',userRouter)
app.use('/api/Product',ProductRouter)
app.use('/api/Like',LikeRouter)
app.use('/api/Comment',CommentRouter)




// Set up server to listen on specified port (default to 3000)
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




// 404 route
app.use('*', (req, res) => {
    res.status(404).json({ 'Msg': 'I Can\'t Found' });
});
  



