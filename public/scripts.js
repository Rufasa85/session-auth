$("#createTurtleForm").on("submit",event=>{
    event.preventDefault();
    console.log('turtle submitted!');
    const turtleObj = {
        name: $("#turtleName").val(),
        age: $("#turtleAge").val(),
        isTeenageMutantNinja: $("#turtleMutant").val()
    }
    console.log(turtleObj)
    $.ajax({
        method:"POST",
        url:"/api/turtles",
        data:turtleObj
    }).then(apiRes=>{
        console.log(apiRes);
        window.location.href= "/myprofile"
    })
})

$("#editTurtleForm").on("submit",event=>{
    event.preventDefault();
    console.log('turtle edited!');
    const turtleObj = {
        name: $("#editTurtleName").val(),
        age: $("#editTurtleAge").val(),
        isTeenageMutantNinja: $("#editTurtleMutant").val()
    }
    console.log(turtleObj)
    const turtleId = $("#editTurtleId").val()
    console.log(turtleId)
    $.ajax({
        method:"PUT",
        url:`/api/turtles/${turtleId}`,
        data:turtleObj
    }).then(apiRes=>{
        console.log(apiRes);
        window.location.href= "/myprofile"
    })
})

$(".delTurtleBtn").on("click",function(event){
    const turtleId = $(this).attr("data-turtleid");
    $.ajax({
        method:"DELETE",
        url:`/api/turtles/${turtleId}`
    }).then(data=>{
       window.location.reload();
    })
})