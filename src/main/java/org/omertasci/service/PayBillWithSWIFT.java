package org.omertasci.service;

import java.util.Date;

public class PayBillWithSWIFT implements IPayBill{

	String bankSwiftCode;
	String recieverFirstName;
	String recieverLastName;
	Date transferDate;
	
	
	public PayBillWithSWIFT (String bankSwiftCode,String recieverFirstName,String recieverLastName,	Date transferDate){
		this.bankSwiftCode = bankSwiftCode;
		this.recieverFirstName = recieverFirstName;
		this.recieverLastName =recieverLastName;
		this.transferDate = transferDate;
	}
	
	public String getBankSwiftCode() {
		return bankSwiftCode;
	}

	public void setBankSwiftCode(String bankSwiftCode) {
		this.bankSwiftCode = bankSwiftCode;
	}

	public String getRecieverFirstName() {
		return recieverFirstName;
	}

	public void setRecieverFirstName(String recieverFirstName) {
		this.recieverFirstName = recieverFirstName;
	}

	public String getRecieverLastName() {
		return recieverLastName;
	}

	public void setRecieverLastName(String recieverLastName) {
		this.recieverLastName = recieverLastName;
	}

	public Date getTransferDate() {
		return transferDate;
	}

	public void setTransferDate(Date transferDate) {
		this.transferDate = transferDate;
	}

	@Override
	public String payBookBill() {

		System.out.println("---Paying process will completed in this section---Start");
		System.out.println("The bill is paid with SWIFT : " + this.bankSwiftCode + " to "+ this.recieverFirstName + " " + this.recieverLastName + " at " + this.transferDate);		
		System.out.println("---Paying process will completed in this section---End");		
		return null;
	}

}
