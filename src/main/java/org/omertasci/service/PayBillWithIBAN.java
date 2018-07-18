package org.omertasci.service;

import java.util.Date;

public class PayBillWithIBAN implements IPayBill{

	String IBAN;
	Date transferDate;
	
	public PayBillWithIBAN(String IBAN, Date transferDate){
		this.IBAN = IBAN;
		this.transferDate = transferDate;
	}
	
	public String getIBAN() {
		return IBAN;
	}

	public void setIBAN(String iBAN) {
		IBAN = iBAN;
	}

	@Override
	public String payBookBill() {

		System.out.println("---Paying process will completed in this section---Start");
		System.out.println("The bill is paid with IBAN : " + this.IBAN + " at " + this.transferDate);		
		System.out.println("---Paying process will completed in this section---End");
		return null;
	}

}
