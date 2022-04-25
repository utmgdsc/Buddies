using Microsoft.ML;
using Microsoft.ML.Trainers;
using BuddyRecommender;


MLContext mlContext = new MLContext();

(IDataView trainingDataView, IDataView testDataView) = LoadData(mlContext);

ITransformer model = BuildAndTrainModel(mlContext, trainingDataView);

EvaluateModel(mlContext, testDataView, model);

UseModelForSinglePrediction(mlContext, model, 80, 4);

SaveModel(mlContext, trainingDataView.Schema, model);

/// <summary>
/// loads training and testing data
/// </summary>
static (IDataView training, IDataView test) LoadData(MLContext mlContext)
{
    var trainingDataPath = Path.Combine(Environment.CurrentDirectory, "Data", "out-train.csv");
    var testDataPath = Path.Combine(Environment.CurrentDirectory, "Data", "out-test.csv");

    IDataView trainingDataView = mlContext.Data.LoadFromTextFile<BuddyRating>(trainingDataPath, hasHeader: true, separatorChar: ',');
    IDataView testDataView = mlContext.Data.LoadFromTextFile<BuddyRating>(testDataPath, hasHeader: true, separatorChar: ',');
    var preview = testDataView.Preview().RowView;
    return (trainingDataView, testDataView);
}

/// <summary>
/// trains the model
/// NumberOfIterations is for how many iterations the model 
/// runs to fit the data (ideally should be a number where the error
/// starts converging to a certain value).
/// Approximation rank is the dimensions the factored
/// matrix is factored into. If the data represents a nxm
/// matrix, it will be factored into a nxk kxn matrix where
/// k is the approximation rank.
/// </summary>
static ITransformer BuildAndTrainModel(MLContext mlContext, IDataView trainingDataView)
{
    IEstimator<ITransformer> estimator = mlContext.Transforms.Conversion.MapValueToKey(outputColumnName: "RaterIdEncoded", inputColumnName: "RaterId")
    .Append(mlContext.Transforms.Conversion.MapValueToKey(outputColumnName: "BeingRatedIdEncoded", inputColumnName: "BeingRatedId"));

    var options = new MatrixFactorizationTrainer.Options
    {
        MatrixColumnIndexColumnName = "RaterIdEncoded",
        MatrixRowIndexColumnName = "BeingRatedIdEncoded",
        LabelColumnName = "Label",
        NumberOfIterations = 1000,
        ApproximationRank = 100
    };

    var trainerEstimator = estimator.Append(mlContext.Recommendation().Trainers.MatrixFactorization(options));

    Console.WriteLine("=============== Training the model ===============");
    ITransformer model = trainerEstimator.Fit(trainingDataView);

    return model;
}

/// <summary>
/// evaluates the model with the test data
/// </summary>
static void EvaluateModel(MLContext mlContext, IDataView testDataView, ITransformer model)
{
    Console.WriteLine("=============== Evaluating the model ===============");
    var prediction = model.Transform(testDataView);
    var metrics = mlContext.Regression.Evaluate(prediction, labelColumnName: "Label", scoreColumnName: "Score");
    Console.WriteLine("Root Mean Squared Error : " + metrics.RootMeanSquaredError.ToString());
    Console.WriteLine("RSquared: " + metrics.RSquared.ToString());
}

/// <summary>
/// Makes prediction for single rater, beingrated pair
/// </summary>
static void UseModelForSinglePrediction(MLContext mlContext, ITransformer model, int rater, int rated)
{
    Console.WriteLine("=============== Making a prediction ===============");
    var predictionEngine = mlContext.Model.CreatePredictionEngine<BuddyRating, BuddyRatingPrediction>(model);
    var testInput = new BuddyRating { RaterId = rater, BeingRatedId = rated };
    var movieRatingPrediction = predictionEngine.Predict(testInput);
    Console.WriteLine("User " + testInput.BeingRatedId + " is recommended for user " + testInput.RaterId + " with rating " + movieRatingPrediction.Score);
}

/// <summary>
/// Saves the model
/// </summary>
void SaveModel(MLContext mlContext, DataViewSchema trainingDataViewSchema, ITransformer model)
{
    var modelPath = Path.Combine(Environment.CurrentDirectory, "Data", "BuddyRecommenderModel.zip");

    Console.WriteLine("=============== Saving the model to a file ===============");
    mlContext.Model.Save(model, trainingDataViewSchema, modelPath);

}

