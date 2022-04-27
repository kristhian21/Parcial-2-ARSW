/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.clickrace.model;

/**
 *
 * @author hcadavid
 */
public class RaceParticipant implements Comparable<RaceParticipant>{

    private int number;
    private int xpos;
    private boolean winner;

    public RaceParticipant() {
    }

    public RaceParticipant(int number) {
        this.number = number;
    }

    public int getNumber() {
        return number;
    }

    @Override
    public int hashCode() {
        int hash = 5;
        hash = 29 * hash + this.number;
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final RaceParticipant other = (RaceParticipant) obj;
        if (this.number != other.number) {
            return false;
        }
        return true;
    }

    @Override
    public int compareTo(RaceParticipant o) {
        return o.getNumber()-this.getNumber();
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public void setXpos(int xpos) {
        this.xpos = xpos;
    }

    public int getXpos() {
        return xpos;
    }

    public void setWinner(){
        winner = true;
    }

    public boolean isWinner() {
        return winner;
    }
}
