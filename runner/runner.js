$(function(){

   console.log('ready');
   $('#btn').click(function (e) {
        e.preventDefault();

        $.get('http://localhost:3000/api/fotolia')
            .done(function (data) {
                console.log('fotolia', data);
            });

        $.get('http://localhost:3000/api/dreamstime')
            .done(function (data) {
                console.log('dreamstime', data);
            });    

    
        $.get('http://localhost:3000/api/snapwire')
            .done(function (data) {
                console.log('snapwire', data);
            });    

        $.get('http://localhost:3000/api/gettyimages')
            .done(function (data) {
                console.log('gettyimages', data);
            });    

        $.get('http://localhost:3000/api/bigstockphoto')
            .done(function (data) {
                console.log('bigstockphoto', data);
            });   

        $.get('http://localhost:3000/api/123rf')
            .done(function (data) {
                console.log('123rf', data);
            });      

   });

});