// Return <select> by <li>
var findSelectByLi = function(li) {
  return $(li).closest('.select-area').find('select')
}

// Return <option> by <li>
var findOptionByLi = function(li) {
  var index = $(li).index()
  var options = findSelectByLi(li).find('option')
  return $(options[index])
};
