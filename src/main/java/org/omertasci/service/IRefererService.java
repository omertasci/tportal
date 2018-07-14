package org.omertasci.service;

import org.omertasci.web.dom.Referer;

import java.util.List;

public interface IRefererService {

	List<Referer> findAll();

	void add(final Referer refererObject);

	void removeIndexAndAllAfter(final int index);

	List<Referer> removeAll();


}
