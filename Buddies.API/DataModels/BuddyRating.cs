using Microsoft.ML.Data;

namespace Buddies.API.DataModels
{
    public class BuddyRating
    {
        [LoadColumn(0)]
        public float RaterId;
        [LoadColumn(1)]
        public float BeingRatedId;
        [LoadColumn(2)]
        public float Label;
    }
}
