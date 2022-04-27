

//local player data
var mycar=undefined;
var mycarxpos=10;
var mycarypos=10;


//competitors data
var loadedCars=[];
var carsCurrentXPositions=[];
var carsCurrentYPositions=[];


var stompClient = null;
var stop = true;

movex = function(){    
    mycarxpos+=10;
    paintCars();
    stompClient.send("/app/car"+mycar.number, {}, JSON.stringify({number:mycar.number,xpos:mycarxpos}));
};


initAndRegisterInServer = function(){
    mycar={number:$("#playerid").val()};
    mycarxpos=10;
    mycarypos=10;

    var socket = new SockJS('/stompendpoint');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
    
    $.ajax({
        url: "races/25/participants",
        type: 'PUT',
        data: JSON.stringify(mycar),
        contentType: "application/json"
    }).then(
            function(){                
                alert("Competitor registered successfully!");
                stompClient.subscribe('/topic/clickRace25',function (eventbody) {
                    if(stop){
                        loadCompetitorsFromServer();
                        addPlayButton();
                        paintCars();
                        stop = false;
                    }
                });
                stompClient.subscribe('/topic/winner25',function (eventbody) {
                    console.log("Ganador!");
                    getWinner();
                    stop = true;
                });
                stompClient.send('/app/clickRace25',{}, JSON.stringify("Car #" + mycar.number + " registered"));
                removeRegister();
            },
            function(err){
                alert("err:"+err.responseText);
            }        
        );
});

loadCompetitorsFromServer = function () {
    if (mycar == undefined) {
        alert('Register your car first!');
    } else {
        $.get("races/25/participants",
                function (data) {
                    loadedCars = data;
                    var carCount = 1;
                    alert("Competitors loaded!");
                    loadedCars.forEach(
                            function (car) {
                                if (car.number != mycar.number) {
                                    carsCurrentXPositions[car.number] = 10;
                                    carsCurrentYPositions[car.number] = 40 * carCount;
                                    carCount++;
                                }
                            }
                    );
                    paintCars();
                    connectAndSubscribeToCompetitors();
                }
        );
    }

};


function getWinner(){
    $.ajax({
        url: "races/25/winner",
        type: 'GET',
        contentType: "application/json"
    }).then(
            function(data){        
                console.log(data);        
                alert("Winner!\nCar number: " + data);
            }        
        );
}


function connectAndSubscribeToCompetitors() {
        loadedCars.forEach(               
                function (car) {
                    //don't load my own car
                    if (car.number!=mycar.number){
                        stompClient.subscribe('/topic/car'+car.number, function (data) {
                            msgdata=JSON.parse(data.body);
                            carsCurrentXPositions[msgdata.number]=msgdata.xpos;   
                            paintCars();
                        });
                    }
                }
        );
}

function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function addPlayButton(){
    var newPlayButton = parseHtml("<button id=\"movebutton\" class=\"controls\" onclick=\"movex()\" >MOVE MY CAR!</button>");
    document.getElementById("winner").before(newPlayButton);
}


function parseHtml(html){
    var t = document.createElement('template');
    t.innerHTML = html;
    return t.content;
}

function removeRegister(){
    document.getElementById("register").remove();
}

paintCars=function(){
    canvas=$("#cnv")[0];
    ctx=canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //paint my car
    paint(mycar,mycarxpos,mycarypos,ctx);
    
    //paint competitors cars
    loadedCars.forEach(
            function(car){
                paint(car,carsCurrentXPositions[car.number],carsCurrentYPositions[car.number],ctx);
            }
    );
};


paint=function(car,xposition,yposition,ctx){
    
    var img = new Image;
    img.src = "img/car.png";
    img.onload = function(){        
        ctx.drawImage(img,xposition,yposition); 
        ctx.fillStyle = "white";
        ctx.font = "bold 16px Arial";
        ctx.fillText(""+car.number, xposition+(img.naturalWidth/2), yposition+(img.naturalHeight/2));        
    };    
};


$(document).ready(
        
        function () {
            console.info('loading script!...');
            $(".controls").prop('disabled', false);    
            $("#racenum").prop('disabled', true);    
        }
)};
