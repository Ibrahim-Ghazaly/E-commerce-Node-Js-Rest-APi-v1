/* eslint-disable node/no-unsupported-features/es-syntax */
class ApiFeatures {

    constructor(mongoseQuery,queryString){
      this.queryString = queryString;
      this.mongoseQuery = mongoseQuery
    }

    filter(){
          // 1)Filtering 
        const queryStringObj = {...this.queryString}
        const excludsFields =['limit','page','sort','fields'];
        excludsFields.forEach(field => delete  queryStringObj[field])

        //Aplly filtering using [gte,gt,lte,lt]

        let queryStr = JSON.stringify(queryStringObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,(match)=> `$${match}`)

        this.mongoseQuery = this.mongoseQuery.find(JSON.parse(queryStr));

        return this;
     }

     sort(){
            //3)sorting 
     if(this.queryString.sort){
        const sortBy = this.queryString.sort.split(",").join(" ");
        this.mongoseQuery = this.mongoseQuery.sort(sortBy)
      }else{
        this.mongoseQuery = this.mongoseQuery.sort("-created_at")

      }

      return this
     }

    limitFields(){
         
           //4)Fields limiting 
    if(this.queryString.fields){
        const fields = this.queryString.fields.split(",").join(" ");
        this.mongoseQuery = this.mongoseQuery.select(fields)
      }else{
        this.mongoseQuery =  this.mongoseQuery.select("-_v")
    
      }

      return this;
    }

    search(modelName) {
        if (this.queryString.keyword) {
          let query = {};
          if (modelName === 'Products') {
            query.$or = [
              { title: { $regex: this.queryString.keyword, $options: 'i' } },
              { description: { $regex: this.queryString.keyword, $options: 'i' } },
            ];
          } else  {
            query = { name: { $regex: this.queryString.keyword, $options: 'i' } };
          }
    
          this.mongooseQuery = this.mongooseQuery.find(query);
        }
        return this;
      }
    

        paginate(countDocuments){
                //2)Pagination    
        const limit = this.queryString.limit*1 || 10;
        const page = this.queryString.page*1 || 1;
        const skip = (page - 1) * limit;
        const endIndex =page * limit;
   
        // pagination results 

        const pagination = {};

        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.numOfPages =Math.ceil(countDocuments / limit);

        //next page 
        if(endIndex < countDocuments){
            pagination.next = page + 1;
        }

        if(skip > 0){
            pagination.prev = page - 1;

        }



        this.mongoseQuery = this.mongoseQuery.skip(skip).limit(limit);
        this.paginationResult = pagination;

        return this

        }
   
}


module.exports = ApiFeatures;