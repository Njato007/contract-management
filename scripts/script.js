const genCode = () => {
    let code = "";
    for (let i = 0; i <= 5; i++) {
        code += Math.floor(Math.random() * 10)
    }
    return code;
}

const sendCode = (transporter, to_email, code) => {
    
    var mailOptions = {
        from: process.env.MAIN_USER,
        to: to_email,
        subject: "Contract management",
        html: codeTemplate(code),
    };
    transporter.sendMail(mailOptions, function (error, info) {
        console.log(error || 'Message has been sent to ' + to_email)
        transporter.close();
    });
}

const codeTemplate = (code) => {
    return `Hi, <br><br>Use this code to reset your password: ${code} <br><br>Many thanks`
}

`Afghanistan	40401
African Oil Exporters	57215	Afric
African Regional Organizations	76902
Albania	15105
Algeria	50105
All Countries	69995
All Other Countries	63908
Angola	50202
Anguilla	30228
Antigua and Barbuda	35203
Argentina	30104
Armenia	16519
Aruba	35254
Asian Oil Exporters	46612	Asian
Asian Regional Organizations	75906
Australia	60089
Austria	10189
Azerbaijan	16527
Bahamas	35319
Bahrain	40703
Bangladesh	40746
Barbados	30155
Belarus	16209
Belgium	10251
Belgium-Luxembourg	10251
Belize	35718
Bermuda	35602
Bolivia	30201
Bonaire, Sint Eustatius, & Saba	36161
Bosnia and Herzegovina	14109
Botswana	50504
Brazil	30309
British Indian Ocean Territory	60208
British Virgin Islands	35807
British West Indies	36005	Begin
Brunei	41009
Bulgaria	15202
Cambodia	41203
Cameroon	51004
Canada	29998
Caribbean Regional Organizations	74942
Cayman Islands	36137	Begin
Channel Islands and Isle of Man	13056
Chile	30406
Chi
China, Mainland	41408
Chi
Chi
Colombia	30503
Congo Kinshasa	51705
Costa Rica	30589
Côte d'Ivoire (Ivory Coast)	53007
Country Unknown	88862
Croatia	14214
Cuba	30708
Curaçao	36188
Cyprus	10405
Czech Republic	15288
Dem
Denmark	10502
Dominica	36218
Dominican Republic	30805
East Timor (Timor-Leste)	45004
Ecuador	31003
Egypt	57002
El Salvador	31089
Eritrea	52019
Estonia	15407
Ethiopia	52108
Euro Area	16713	The E
European Union	16721	The E
European Regional Organizations	73903
Fiji	60607
Finland	10707
France	10804
French Polynesia	60704
French West Indies	37028
Gabon	52418
Georgia	16535
Germany	11002
German Democratic Republic	16004	Now p
Ghana	52604
Gibraltar	11088
Grand Total	99996
Greece	11207
Grenada	36706
Guatemala	31208
Guernsey	13006
Guinea	52701
Guyana	31305
Haiti	31402
Holy See (Vatican City)	13102
Honduras	31488
Hong Kong	42005
Hungary	15504
Iceland	11304
India	42102
Indonesia	42218
International Organizations	72907
Iran	42307
Iraq	42404
Ireland	11401
Isle of Man	13008
Israel	42501
Italy	11509
Jamaica	31607
Japan	42609
Jersey	13007
Jordan	42706
Kazakhstan	16543
Kenya	53104
Korea, South	43001
Kuwait	43109
Kyrgyzstan	16551
Laos	43303
Latin American Regional Organizations	74918
Latvia	15601
Lebanon	43419
Liberia	53201
Libya	53309
Lithuania	15709
Luxembourg	11703
Macau	43508
Macedonia	14419
Madagascar	53406
Malaysia	43605
Mali	53589
Malta	11819
Marshall Islands	61204
Mauritius	53805
Mexico	31704
Middle Eastern Regional Organizations	77909
Moldova	16306
Monaco	12009
Mongolia	43818
Montserrat	37109
Morocco	54003
Mozambique	54089
Namibia	54127
Nepal	44202
Netherlands	12106
Netherlands Antilles	37206
New Caledonia	61409
New Zealand	61689
Nicaragua	31801
Nigeria	54305
Norway	12203
Oman	44105
Other Africa	58904
Other Asia	48909
Other Caribbean	33596
Other Europe	18007
Other Latin America	39101
Other Latin America & Caribbean	39004
Pakistan	44709
Panama	31887
Paraguay	32107
Papua New Guinea	61751
Paraguay	32107
Peru	32204
Philippines	44806
Poland	15768
Portugal	12319
Qatar	45101
Romania	15806
Russia	16101	From 
Saint Kitts and Nevis	37303
Saint Lucia	37508
Saint Vincent and the Grenadines	37605
Samoa	62618
Saudi Arabia	45608
Senegal	55301
Serbia	13218
Serbia and Montenegro	13218	On Fe
Seychelles	55409
Singapore	46019
Sint Maarten	36196
Slovakia	15318
Slovenia	14338
South Africa	55719
Spain	12505
Sri Lanka	41319
Suriname	37702
Swaziland	56219
Sweden	12602
Switzerland	12688
Syria	46205
Taiwan	46302
Tanzania	56405
Thailand	46418
Tonga	62448
Total Africa	59994
Total Asia	49999
Total Caribbean	34401
Total Europe	19992
Total IROs	79995
Total Latin America	39942
Total Latin America & Caribbean	39993
Total Other	69906
Total Regional Orgs.	76929
Trinidad and Tobago	32409
Tunisia	56707
Turkey	12807
Turks and Caicos Islands	37818
Uganda	56804
Ukraine	16403
United Arab Emirates	46604
United Kingdom	13005
Uruguay	32603
Uzbekistan	16705
Vanuatu	61603
Venezuela	32719
Vietnam	46906
Virgin Islands, British	35807
Yemen	47104`

module.exports = { genCode, sendCode }