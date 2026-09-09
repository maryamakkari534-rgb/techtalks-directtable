package com.directtable.repository;

import com.directtable.entity.CustomerOrder; //get entity costumerorder
import org.springframework.data.jpa.repository.JpaRepository;//interface contains database operations

public interface CustomerOrderRepository//write public interface because spring will do all the implementation
        extends JpaRepository<CustomerOrder, Long> {//responsible of customerOrder entity
}