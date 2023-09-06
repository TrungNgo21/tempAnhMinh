let allItem = true;

$(document).ready(()=>{
  if(allItem === true){
    $.ajax({
                url: '/display_item',
                type: 'post',
                contentType: 'application/json',
                success: (response) => {
                    console.log(response)
                    display_item(response)        
                    allItem = false;
                }
        })
      console.log("Done")};  
    $(document).on('click','.redirect',(function(event){
      event.preventDefault()
      var elemid = this.id;
      console.log(elemid)

      $.ajax({
        url: '/detailed_item',
        type: 'post',
        data: JSON.stringify({
          "item_detail" : elemid
        }),
        dataType: "json",
        contentType: 'application/json',
        success: (response) => {
            console.log(response)
        }
      })
    }))
  })




function display_item(item_list){
document.getElementById("Display-Item").innerHTML = ''

for (let i = 0; i < item_list.length; i++) {
  const myArray = Object.values(item_list[i]);


  document.getElementById("Display-Item").innerHTML += "<div class='col-md-6 col-lg-4 col-xl-3'>"
								+"<div  class='single-product'>"
									+"<a href='' id ='"+ myArray +"' class = 'redirect'>" 
										+"<div class='part-1'>"
											+"<img src="+myArray[0]+" alt='product-img' style='width: 255px;'>"
										+"</div>"
										+"<div class='part-2'>"
												+"<h3 class='product-title'>"+myArray[1]+"</h3>"
									+"</a>"
												+"<h4 class='product-price'>$"+myArray[3]+"</h4>"
                        						+"<h6 class='product-brand'>"+myArray[2]+"</h6>"
												+"<h6 class='product-warehouse'>Shipped From: "+myArray[4]+"</h6>"
										+"</div>"
									
								+"</div>"
						+"</div>";
  }

}

