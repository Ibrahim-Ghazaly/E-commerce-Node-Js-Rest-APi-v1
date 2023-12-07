
const asyncHandler = require('express-async-handler');
const ApiError = require('../utlis/apiError');
const ApiFeatures = require('../utlis/apiFeatures');

exports.delete = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }

      // Trigger "deleteOne" event when update document
      await  document.deleteOne();

    res.status(204).send();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }
     // Trigger "save" event when update document
     document.save();
    res.status(200).json({ data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({ data: newDoc });
  });

exports.getOne = (Model,populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // 1) Build query 
    let query =  Model.findById(id);
    if(populationOpt){
        query = query.populate(populationOpt)
    }


    // 2) Excute query 

    const document = await query
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.getAll = (Model, modelName = '') =>
 
  asyncHandler(async (req, res) => {

    // console.log(req)
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }

    // Build query
    const documentsCounts = await Model.countDocuments();

    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCounts)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();

    // Execute query
    const { mongoseQuery, paginationResult } = apiFeatures;
    const documents = await mongoseQuery;

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });