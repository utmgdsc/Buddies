using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ML.Data;

namespace BuddyRecommender
{
//    internal class BuddyRatingData
//    {
 //   }
    public class BuddyRating
    {
        [LoadColumn(0)]
        public float RaterId;
        [LoadColumn(1)]
        public float BeingRatedId;
        [LoadColumn(2)]
        public float Label;
    }
    public class BuddyRatingPrediction
    {
        public float Label;
        public float Score;
    }
}
