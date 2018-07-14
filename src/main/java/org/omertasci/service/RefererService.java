package org.omertasci.service;


import org.omertasci.persistence.dao.RefererRepository;
import org.omertasci.web.dom.Referer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RefererService implements IRefererService {

    @Autowired
    private RefererRepository refererRepository;

    @Override
    public List<Referer> findAll() {
        return refererRepository.findAll();
    }

    @Override
    public void add(Referer refererObject) {
        refererRepository.add( refererObject );
    }

    @Override
    public void removeIndexAndAllAfter(int index) {
        while(refererRepository.getReferers().size() > index) {
            refererRepository.remove( refererRepository.getReferers().size() - 1 );
        }

    }

    @Override
    public List<Referer> removeAll() {
        refererRepository.clearAll();
        return refererRepository.findAll();
    }
}
