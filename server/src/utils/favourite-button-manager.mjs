// Check database to see if file/folder has been added to favourites, and set favouriteButtonText accordingly
export default function setFavouriteButtonText(rows) {
  rows.forEach((row) => {
    if (row.isFavourite === 'false') {
      row.favouriteButtonText = 'Add to favourites';
    } else {
      row.favouriteButtonText = 'Remove from favourites';
    }
  });
}
