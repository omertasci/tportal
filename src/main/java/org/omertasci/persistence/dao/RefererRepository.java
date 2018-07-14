package org.omertasci.persistence.dao;

import org.omertasci.web.dom.Referer;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class RefererRepository {
    private final List<Referer> referers = new ArrayList<Referer>();

    public List<Referer> getReferers() {
        return referers;
    }

    public RefererRepository() {
        super();
    }

    public List<Referer> findAll() {
        return new ArrayList<Referer>(this.referers);
    }

    public void add(final Referer refererObject) {
        this.referers.add(refererObject);
    }

    public void remove(final int index) {
        this.referers.remove(index);
    }

    public void clearAll() {
        this.referers.clear();
    }

}
