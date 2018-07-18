package org.omertasci.service;

import java.io.PrintStream;
import java.util.Date;

import org.omertasci.web.error.PayTypeNotFoundException;

public class PayBillFactory{

	public static IPayBill getPayingType(String type, String IBAN, String bankSwiftCode,String recieverFirstName,String recieverLastName,Date transferDate)
	{
		try{
			if("IBAN".equalsIgnoreCase(type)) return new PayBillWithIBAN(IBAN, transferDate);
			else if("SWIFT".equalsIgnoreCase(type)) return new PayBillWithSWIFT(bankSwiftCode,recieverFirstName,recieverLastName,transferDate);
			
		}
		catch(Exception e){
			e.printStackTrace();
		}
		
		return null;
	}

}
