using Buddies.API.Entities;
using System.Collections.Generic;

namespace Buddies.API.Services
{
    public class KnnService
    {
        /// <summary>
        /// Return the larger of a and b.
        /// </summary>
        public static double Distance(double[] vector)
        {
            
            double distance = 0;
            foreach (int vectorItem in vector)
            {
                distance += Math.Pow((vectorItem - 1), 2);
            }
            return Math.Pow(distance, 0.5);
        }

        public static double[] GetVector(Project a, Profile b)
        {

            double[] vector = new double[] {0, 0, 0};
            var TOLERANCE = 0;
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

        public static List<Profile> KNearestUsers(Project a, List<Profile> users, int k)
        {

            List<(double, Profile)> recommendations = new List<(double, Profile)>();
            foreach (var user in users)
            {
                var vector = GetVector(a, user);
                var dist = Distance(vector);
                recommendations.Add((dist, user));
            }
            recommendations.Sort((a, b) => a.Item1.CompareTo(b.Item1));
            var kNearest = new List<Profile>();
            for (var i = 0; i < k; i++)
            {
                kNearest.Add(recommendations[i].Item2);
            }
            return kNearest;
        }

    }
}
