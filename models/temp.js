const agg = [
  {
    '$match': {
      'product': new ObjectId('69300abf7f757bcba4b4fdba')
    }
  }, {
    '$group': {
      '_id': 'null', 
      'averageRating': {
        '$avg': '$rating'
      }, 
      'numOfReviews': {
        '$sum': 1
      }
    }
  }
];