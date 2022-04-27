package edu.eci.arsw.clickrace;

import com.google.gson.Gson;
import edu.eci.arsw.clickrace.model.RaceParticipant;
import edu.eci.arsw.clickrace.services.ClickRaceServicesStub;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import edu.eci.arsw.clickrace.services.ClickRaceServices;
import edu.eci.arsw.clickrace.services.ServicesException;


@Controller
public class STOMPMessagesHandler {

    @Autowired
    SimpMessagingTemplate msgt;
    @Autowired
    ClickRaceServicesStub clickService;

    @MessageMapping("/clickRace{num}")
    public synchronized void verifyCars(@DestinationVariable String num) throws MessagingException, ServicesException {
        if(clickService.getRegisteredPlayers(25).size() == 5){
            msgt.convertAndSend("/topic/clickRace"+num, "5 players registered!");
        }
    }

    @MessageMapping("/car{num}")
    public synchronized void verifyWinner(@DestinationVariable String num, String jsonCar){
        Gson gson = new Gson();
        RaceParticipant car = gson.fromJson(jsonCar, RaceParticipant.class);
        if(car.getXpos() >= 640){
            clickService.setWinner(25, car);
            msgt.convertAndSend("/topic/winner25","Winner!\nCar number: "+car.getNumber());
        }
        msgt.convertAndSend("/topic/car"+num, jsonCar);
    }

}
