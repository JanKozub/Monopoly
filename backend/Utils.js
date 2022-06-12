class Utils {
    static generateId() {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < 16; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    static getCard(id) {
        let content = [
            "Nie przebrałeś bucików i dorwał cię dyrektor Piszkowski, płacisz 50$ za woreczki",
            "Zapomniałeś o deadline u Mendeli, kupujesz projekcik za 150$",
            "Nie zabrałeś z domu śniadania, kupujesz hotdoga z dodatkami za 70$",
            "Przyjechałeś samochodem za 9:20 i musisz zaparkować na strefie. Płacisz 100$ za 6h parkingu.",
            "Wszedłeś do DSa bez pukania, tracisz 50$ i dwie jedynki",
            "Oszukiwałeś w szkolnych zawodach szachowych, dyr. Piszkowski cię przyłapał, straciłeś 100$",
            "Przyszedłeś na zakończenie roku bez krawatu ZSŁ, tracisz 100$ bo tak się nie robi",
            "Dyr. Piszkowski sprawdził twoją trzeźwość, tracisz 500$",
            "Paczka papierosów z twojego plecaka została zarekwirowana. Tracisz 100$",
            "Płacisz 200$ składki na studniówkę",
            "Spotykasz doktora S. na korytarzu, dostajesz 150$ za wygranie konkursu historycznego",
            "Wygrywasz konkurs flagi, otrzymujesz 50$",
            "Byłeś z dyr. P. na rybach. Za szczupaka, który robi wrażenie otrzymujesz 200$",
            "Zdałeś wszystkie egzaminy na 100 %, otrzymujesz 1000$",
            "Za zrobienie wszystkich sprawozdań u P. Jakubińskiego otrzymujesz 200$",
            "Wygrywasz zawody siatkarskie jako reprezentacja ZSŁ, otrzymujesz 100$",
            "Sprzedajesz wszystkie ukradzione prcesory od Pana Pudełko za 300$",
            "Otrzymujesz wypłatę z marginesu, 25$",
            "Za udział w praktyce zawodowej otrzymujesz 300$ i sporo doświadczenia",
            "Na zajęciach online piszesz dla kolegi sprawdzian z matematki i otrzymujesz 150$",
        ]
        let action = [
            { action: "take", value: 50 },
            { action: "take", value: 150 },
            { action: "take", value: 70 },
            { action: "take", value: 100 },
            { action: "take", value: 50 },
            { action: "take", value: 100 },
            { action: "take", value: 100 },
            { action: "take", value: 500 },
            { action: "take", value: 100 },
            { action: "take", value: 200 },
            { action: "add", value: 150 },
            { action: "add", value: 50 },
            { action: "add", value: 200 },
            { action: "add", value: 1000 },
            { action: "add", value: 200 },
            { action: "add", value: 100 },
            { action: "add", value: 300 },
            { action: "add", value: 25 },
            { action: "add", value: 300 },
            { action: "add", value: 150 },
        ]
        return ({ text: content[id], action: action[id].action, value: action[id].value });
    }
}

module.exports = Utils