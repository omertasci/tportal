package org.omertasci.drafts;

import java.util.Date;

import org.omertasci.service.IPayBill;
import org.omertasci.service.PayBillFactory;
import org.omertasci.web.error.PayTypeNotFoundException;

public class Main {

	public static void main(String[] args) {
		
		try{
			IPayBill bill = PayBillFactory.getPayingType("IBAN", "TR56 00051 0 0000087594783948", null, null, null, new Date());		
			bill.payBookBill();
			
			IPayBill bill2 = PayBillFactory.getPayingType("SWIFT", null, "TRHBTR2A", "Ömer", "Taşcı", new Date());		
			bill2.payBookBill();	
			
			IPayBill bill3 = PayBillFactory.getPayingType("", null, "TRHBTR2A", "Ömer", "Taşcı", new Date());		
			bill3.payBookBill();
		}
		catch(Exception e){
			throw new PayTypeNotFoundException("The paying type is null or not implemented yet!");
		}
			
		
	}

}
