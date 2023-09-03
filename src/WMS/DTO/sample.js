/*
 * Sample categories object for category listing page in warehouse webpage
 * catelist =
 * [
 *   [ cateObject, [cateObject] ],
 *   [ cateObject, [cateObject] ],
 *   ...
 * ]
 *
 * catelist contain array of an array. 1st item in sub array is parent Category, the second item is an array of all child category belong to the parent category
 * */

class cateObject {
    constructor(id, name, attributeArray) {
        this.id = id;
        this.name = name;
        this.attribute = attributeArray; //contain an array of all attribute from this category including attribute from parent category
    }
}
