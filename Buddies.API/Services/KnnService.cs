using Buddies.API.Entities;
using Microsoft.Extensions.ML;
using Buddies.API.DataModels;

namespace Buddies.API.Services
{
    public class KnnService
    {

        /// <summary>
        /// Calculate distance between vector and project vector
        /// </summary>
        public static double Distance(double[] vector, int n)
        {
            double distance = 0;
            for (int i = 0; i < n; i++)
            {
                if (i < vector.Length)
                {
                    distance += Math.Pow((vector[i] - 1), 2);
                } else
                {
                    distance += 1;
                }
            }
            return Math.Pow(distance, 0.5);
        }

        /// <summary>
        /// Find user b's vector
        /// </summary>
        public static double[] GetVector(Project a, Profile b)
        {

            double[] vector = new double[a.Skills.Count];
       
            foreach (var skill in b.Skills)
            {
                var i = 0;
                foreach (var projectSkill in a.Skills)
                {
                    string output = "";
                    double subsequenceTolerated = FuzzySearchService.LongestCommonSubsequence(projectSkill.Name.ToLower(), skill.Name.ToLower(), out output) / (double)projectSkill.Name.Length;
                    if (subsequenceTolerated > vector[i])
                    {
                        vector[i] = subsequenceTolerated;
                    }
                    i++;
                }

            }

            return vector;
        }

        /// <summary>
        /// Return the top k recommended users
        /// </summary>
        public static List<(Profile, double)> KNearestUsers(Project a, List<Profile> users, int k, PredictionEnginePool<BuddyRating, BuddyRatingPrediction> predictionEnginePool)
        {

            List<(double, (Profile, double))> recommendations = new List<(double, (Profile, double))>();
            double normalizer = Math.Pow(a.Skills.Count, 0.5);
            double C1 = 0.99;
            double C2 = 0.01;
            foreach (var user in users)
            {
                var vector = GetVector(a, user);
                var dist = Distance(vector, a.Skills.Count);
                var ksim = (double)(-1 * (dist - normalizer)) / (normalizer);
                var norm = normalizer;
                if (normalizer == 0)
                {
                    ksim = 0;
                    norm = 1;
                }
                var input = new BuddyRating { RaterId = a.Owner.Id, BeingRatedId = user.UserId };
                BuddyRatingPrediction prediction = predictionEnginePool.Predict(modelName: "BuddyRecommenderModel", example: input);
                var msim = (double)prediction.Score / 5;
                recommendations.Add(((C1*dist) - (C2 * msim * norm), (user, (C1*ksim) + (C2 * msim))));
            }
            recommendations.Sort((a, b) => a.Item1.CompareTo(b.Item1));
            var kNearest = new List<(Profile, double)>();
            for (var i = 0; i < Math.Min(k, recommendations.Count); i++)
            {
                kNearest.Add(recommendations[i].Item2);               
            }
            return kNearest;
        }

    }
}
