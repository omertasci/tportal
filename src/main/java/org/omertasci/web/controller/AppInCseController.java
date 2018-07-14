package org.omertasci.web.controller;

import org.omertasci.service.IAppInCseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Controller
public class AppInCseController {

    @Autowired
    IAppInCseService appInCseService;

    @Autowired
    private MessageSource messages;

    private final String RCN_PREFIX = "rcn";

    @RequestMapping(value = "/app/incse/gelAllContent", method = RequestMethod.POST)
    public String getAllResultContent(final Locale locale, final Model model, @RequestParam("rcn") final String rcn) throws Exception {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put(RCN_PREFIX, rcn);

        final String result = appInCseService.sendGetRequest(params);
        if(result == null) {
            model.addAttribute("message", messages.getMessage("message.error", null, locale));
            return "resultContent";
        }

        model.addAttribute("message","SUCCESS");
        model.addAttribute("result", result);

        return "resultContent";
    }
}
