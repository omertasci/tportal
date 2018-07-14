package org.omertasci.spring;

import java.util.List;
import java.util.Locale;

import org.omertasci.validation.EmailValidator;
import org.omertasci.validation.PasswordMatchesValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.thymeleaf.spring4.SpringTemplateEngine;
import org.thymeleaf.spring4.view.ThymeleafViewResolver;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.context.request.RequestContextListener;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.i18n.CookieLocaleResolver;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.hibernate5.Hibernate5Module;

@Configuration
@ComponentScan(basePackages = { "org.omertasci.web" })
@EnableWebMvc
public class MvcConfig extends WebMvcConfigurerAdapter {
    @Autowired
    private Environment env;

    public MvcConfig() {
        super();
    }


    //

    @Override
    public void addViewControllers(final ViewControllerRegistry registry) {
        super.addViewControllers(registry);
        registry.addViewController("/").setViewName("forward:/login");
        registry.addViewController("/login");
        registry.addViewController("/user/registration");
        registry.addViewController("/registration.html");
        registry.addViewController("/registrationCaptcha.html");
        registry.addViewController("/logout.html");
        registry.addViewController("/homepage.html");
        registry.addViewController("/expiredAccount.html");
        registry.addViewController("/badUser.html");
        registry.addViewController("/emailError.html");
        registry.addViewController("/home.html");
        registry.addViewController("/invalidSession.html");
        registry.addViewController("/index.html");
        registry.addViewController(env.getProperty( "server.contextPath" ) + "/index.html/ajax");
        registry.addViewController("/gw.html");
        registry.addViewController("/device.html");
        registry.addViewController(env.getProperty( "server.contextPath" ) + "/device.html/ajax");
        registry.addViewController("/console.html");
        registry.addViewController("/admin.html");
        registry.addViewController("/successRegister.html");
        registry.addViewController("/forgetPassword.html");
        registry.addViewController("/updatePassword.html");
        registry.addViewController("/changePassword.html");
        registry.addViewController("/users.html");
        registry.addViewController("/qrcode.html");
        registry.addViewController("/home-manager-gateway-list.html");
        registry.addViewController("/home-manager-gateway-detail.html");
        registry.addViewController("/resultContent.html");
        registry.addViewController("/manageCompany.html");
        registry.addViewController(env.getProperty( "server.contextPath" ) + "/manageCompany.html/ajax");
        registry.addViewController("/manageCSEState.html");
        registry.addViewController(env.getProperty( "server.contextPath" ) + "/manageCSEState.html/ajax");
        registry.addViewController("/managePrivilege.html");
        registry.addViewController(env.getProperty( "server.contextPath" ) + "/managePrivilege.html/ajax");
        registry.addViewController("/manageRole.html");
        registry.addViewController(env.getProperty( "server.contextPath" ) + "/manageRole.html/ajax");
        registry.addViewController("/manageUser.html");
        registry.addViewController(env.getProperty( "server.contextPath" ) + "/manageUser.html/ajax");
        registry.addViewController("/manageGWGroup.html");
        registry.addViewController(env.getProperty( "server.contextPath" ) + "/manageGWGroup.html/ajax");
        registry.addViewController("/manageLogging.html");
        registry.addViewController(env.getProperty( "server.contextPath" ) + "/manageLogging.html/ajax");
        registry.addViewController("/gatewaygroup.html");
        registry.addViewController(env.getProperty( "server.contextPath" ) + "/gatewaygroup.html/ajax");
        registry.addViewController("/gateway.html");
        registry.addViewController(env.getProperty( "server.contextPath" ) + "/gateway.html/ajax");
        registry.addViewController("/forbidden.html");
        registry.addViewController("/notreachable.html");
        registry.addViewController("/leftMenu.html");
        registry.addViewController("/resourceMap.html");
        registry.addViewController(env.getProperty( "server.contextPath" ) + "/resourceMap.html/ajax");
        registry.addViewController("/report1.html");
        registry.addViewController(env.getProperty( "server.contextPath" ) + "/consumption-dimlevelReport.html/ajax");
        registry.addViewController("/consumption-dimlevelReport.html");
        registry.addViewController(env.getProperty( "server.contextPath" ) + "/basicReportTemplate/ajax");
        registry.addViewController("/basicReportTemplate.html");
        registry.addViewController(env.getProperty( "server.contextPath" ) + "/report1.html/ajax");
        registry.addViewController("/manageApplication.html");
        registry.addViewController(env.getProperty( "server.contextPath" ) + "/manageApplication.html/ajax");
        registry.addViewController("/widgetContainer.html");
        registry.addViewController(env.getProperty( "server.contextPath" ) + "/widgetContainer.html/ajax");
        registry.addViewController("/modelRefreshingController");
        registry.addViewController(env.getProperty( "server.contextPath" ) + "/widgetContainer.html/observer");
        registry.addViewController(env.getProperty( "server.contextPath" ) + "/modelRefreshingController/ajax");
    }

    @Override
    public void configureDefaultServletHandling(final DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }

    @Override
    public void addResourceHandlers(final ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/resources/**").addResourceLocations("/", "/resources/");
//        registry.addResourceHandler("/static**").addResourceLocations("/resources/static");
//        registry.addResourceHandler("/static/css**").addResourceLocations("/resources/static/css");
    }

    @Override
    public void addInterceptors(final InterceptorRegistry registry) {
        final LocaleChangeInterceptor localeChangeInterceptor = new LocaleChangeInterceptor();
        localeChangeInterceptor.setParamName("lang");
        registry.addInterceptor(localeChangeInterceptor);
    }

    // beans

    @Bean
    public LocaleResolver localeResolver() {
        final CookieLocaleResolver cookieLocaleResolver = new CookieLocaleResolver();
        cookieLocaleResolver.setDefaultLocale(Locale.ENGLISH);
        return cookieLocaleResolver;
    }

    @Bean
    public MessageSource messageSource() {
        final ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasename("classpath:messages");
        messageSource.setUseCodeAsDefaultMessage(true);
        messageSource.setDefaultEncoding("UTF-8");
        messageSource.setCacheSeconds(0);
        return messageSource;
    }

    @Bean
    public EmailValidator usernameValidator() {
        return new EmailValidator();
    }

    @Bean
    public PasswordMatchesValidator passwordMatchesValidator() {
        return new PasswordMatchesValidator();
    }

    @Bean
    @ConditionalOnMissingBean(RequestContextListener.class)
    public RequestContextListener requestContextListener() {
        return new RequestContextListener();
    }
    
    @Bean
    CharacterEncodingFilter characterEncodingFilter() {
        CharacterEncodingFilter filter = new CharacterEncodingFilter();
        filter.setEncoding("UTF-8");
        filter.setForceEncoding(true);
        return filter;
    }

    public MappingJackson2HttpMessageConverter jacksonMessageConverter(){
        MappingJackson2HttpMessageConverter messageConverter = new MappingJackson2HttpMessageConverter();

        ObjectMapper mapper = new ObjectMapper();
        //Registering Hibernate4Module to support lazy objects
        mapper.registerModule(new Hibernate5Module());

        messageConverter.setObjectMapper(mapper);
        return messageConverter;

    }

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        //Here we add our custom-configured HttpMessageConverter
        converters.add(jacksonMessageConverter());
        super.configureMessageConverters(converters);
    }
//    @Bean
//    @Description("Thymeleaf template resolver serving HTML 5")
//    public ClassLoaderTemplateResolver templateResolver() {
//        
//        ClassLoaderTemplateResolver templateResolver = new ClassLoaderTemplateResolver();
//        
//        templateResolver.setPrefix("templates/");
//        templateResolver.setCacheable(false);
//        templateResolver.setSuffix(".html");        
//        templateResolver.setTemplateMode("HTML5");
//        templateResolver.setCharacterEncoding("ISO-8859-9");
//        
//        return templateResolver;
//    }
//
//    @Bean
//    @Description("Thymeleaf template engine with Spring integration")
//    public SpringTemplateEngine templateEngine() {
//        
//        SpringTemplateEngine templateEngine = new SpringTemplateEngine();
//        templateEngine.setTemplateResolver(templateResolver());
//
//        return templateEngine;
//    }
//
//    @Bean
//    @Description("Thymeleaf view resolver")
//    public ViewResolver viewResolver() {
//
//        ThymeleafViewResolver viewResolver = new ThymeleafViewResolver();
//        
//        viewResolver.setTemplateEngine(templateEngine());
//        viewResolver.setCharacterEncoding("ISO-8859-9");
//
//        return viewResolver;
//    } 
}