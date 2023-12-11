const path = require('path');
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cors = require("cors")
const compression = require('compression')
// eslint-disable-next-line import/no-extraneous-dependencies
const rateLimit  = require('express-rate-limit')
// eslint-disable-next-line import/no-extraneous-dependencies
const hpp = require('hpp')
const xss = require('xss-clean')

const mongoSanitize = require('express-mongo-sanitize');
const ApiError = require('./utlis/apiError')
const dbConnection = require('./config/database')
const {webhookCheckout} = require('./controllers/order.controller')




//Routs
const mountRoutes = require('./routes');



const globalError = require('./middlewares/globalErrorMiddleware')

dotenv.config({path:'config.env'})



// connect with database 
dbConnection()


// express app
const app = express()
//Enable other domains to access your application
app.use(cors());
app.options('*',cors());


// compress all responses
app.use(compression())

// Checkout webhook
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
);


//middellwares
app.use(express.json({limit:'70kb'}));
app.use(express.static(path.join(__dirname,'uploads')))

// To remove data using these defaults:and making clean query from attackers [sanatize]
app.use(mongoSanitize());
app.use(xss())

//Express middleware to protect against HTTP Parameter Pollution attacks
app.use(hpp({whitelist:['price','sold,','quantity','ratingsAverage','ratingsQuantity']}))




const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message: {
    error: 'Rate limit reached; please try making this request after sometime!'
  },
  standardHeaders: true,
  legacyHeaders: false,
}
)

// Apply the rate limiting middleware to all requests.
app.use(limiter)




if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
       console.log(`mode ${process.env.NODE_ENV}`)
    }

//Mount Routes
mountRoutes(app)





app.all("*",(req,res,next)=>
    //create error and send it to error handling middleware

    next(new ApiError(`can't find this route ${req.originalUrl}`,400))
)

//Global Error handling middleware
app.use(globalError)

// Server 
const port = process.env.PORT || 8000
const server = app.listen(port,()=>{
    console.log(`app running on port ${port}`)
})


//handle rejection outside express

process.on('unhandledRejection',(err)=>{
    console.error(`unhandeled Rejection Errors :${err.name} | ${err.message}`);
  server.close(()=>{
    console.error('server shuting down ....');
    process.exit(1);
  })
})