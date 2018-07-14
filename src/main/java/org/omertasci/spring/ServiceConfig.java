package org.omertasci.spring;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan({ "org.omertasci.service" })
public class ServiceConfig {
}
