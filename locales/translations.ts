
export type Locale = 'it' | 'en' | 'de' | 'fr' | 'ru';

export interface Language {
    [key: string]: string | Language;
}

export const translations: Record<Locale, Language> = {
    it: {
        header: {
            experiences: "Esperienze",
            projects: "Progetti",
            keepInTouch: "Resta in Contatto",
            synchronizeConnection: "Sincronizza Connessione",
            hmCertification: "Certificazione HM",
        },
        hub: {
            title: "Esperienze Digitali, Tocco Umano.",
            subtitle: "Esplora spazi interattivi progettati per riconnettersi con l'elemento umano in un mondo digitale.",
            card: {
                enterExperience: "Entra nell'Esperienza",
            },
            card1: {
                title: "Resta in Contatto",
                description: "Uno spazio per una comunicazione lenta e deliberata. Invia un messaggio ogni 24 ore e attendi una risposta ponderata.",
            },
            card2: {
                title: "Sincronizza Connessione",
                description: "Un puzzle logico collaborativo. Ogni interazione influenza la griglia. Lavora con gli altri per raggiungere la piena sincronizzazione.",
            }
        },
        keepInTouch: {
            title: "Resta in Contatto",
            hub: "Hub",
            intro: {
                line1: "Lo scopo di questo spazio è ristabilire una connessione lenta e umana. Si tratta di abbracciare la curiosità per ciò che viene \"dopo\", senza il bisogno di \"tutto in una volta\".",
                line2: "Puoi inviare un messaggio ogni 24 ore. Non vedo l'ora di sentirti.",
            },
            placeholder: "Scrivi qui il tuo messaggio...",
            cooldown: {
                thankYou: "Grazie per il tuo messaggio!",
                replySoon: "Risponderò presto. Abilita le notifiche per rimanere in contatto.",
                nextMessage: "Prossimo messaggio disponibile tra:",
                loading: "Caricamento...",
            }
        },
        beHuman: {
            title: "Sincronizza Connessione",
            subtitle: "La griglia è uno spazio condiviso. Altre connessioni vengono stabilite. Lavorate insieme per raggiungere la sincronizzazione.",
            timerLabel: "Tempo Trascorso",
            forceSync: "Forza Sincronizzazione",
            forceSyncLoading: "Sincronizzazione...",
            solved: {
                title: "Sincronizzazione Raggiunta",
                description: "Tutte le connessioni sono ora attive.",
                completionTime: "Tempo di completamento: {time}",
                participants: "{count} interazioni hanno contribuito.",
            },
            cooldown: {
                nextSync: "Prossima sincronizzazione disponibile tra:",
                loading: "Caricamento...",
            },
            backToHub: "Torna all'Hub",
        },
        certification: {
            hub: "Hub",
            title: "Certificazione Human Made",
            subtitle: "Il Prodotto Organico della Tecnologia.",
            p1: "In un'era dominata dall'intelligenza artificiale, il sigillo <bold>Human Made</bold> significa un impegno per la creatività umana pura e non assistita. Questa certificazione viene assegnata a prodotti, opere d'arte e servizi creati senza l'uso di IA generativa nel loro processo creativo principale.",
            p2: "Rappresenta il valore del tocco umano, dell'intenzione e dell'abilità. Dal codice scritto a mano alla musica composta originalemente, la certificazione Human Made sostiene l'output unico, imperfetto e profondamente personale che solo una mente umana può concepire.",
            p3: "Crediamo che, sebbene l'IA sia uno strumento potente, esista una qualità insostituibile nelle creazioni nate dall'esperienza, dalla lotta e dall'ispirazione umana. Questo progetto mira a preservare ed evidenziare tale qualità, offrendo una chiara distinzione per i consumatori che cercano autenticità in un mondo digitalmente saturo.",
            principles: {
                title: "Principi Fondamentali:",
                authenticity: "<bold>Autenticità:</bold> Verificare che il lavoro concettuale ed esecutivo sia guidato da autori umani.",
                transparency: "<bold>Trasparenza:</bold> Dichiarazione chiara degli strumenti utilizzati, garantendo che nessuna IA generativa abbia fatto parte dell'ideazione o della produzione creativa.",
                craftsmanship: "<bold>Artigianalità:</bold> Celebrare l'abilità, il tempo e la dedizione inerenti alle opere realizzate dall'uomo.",
            }
        }
    },
    en: {
        header: {
            experiences: "Experiences",
            projects: "Projects",
            keepInTouch: "Keep in Touch",
            synchronizeConnection: "Synchronize Connection",
            hmCertification: "HM Certification",
        },
        hub: {
            title: "Digital Experiences, Human Touch.",
            subtitle: "Explore interactive spaces designed to reconnect with the human element in a digital world.",
            card: {
                enterExperience: "Enter Experience",
            },
            card1: {
                title: "Keep in Touch",
                description: "A space for slow, deliberate communication. Send one message every 24 hours and await a thoughtful reply.",
            },
            card2: {
                title: "Synchronize Connection",
                description: "A collaborative resonance puzzle. Every presence influences the grid. Work in unison to achieve full synchronization.",
            }
        },
        keepInTouch: {
            title: "Keep in Touch",
            hub: "Hub",
            intro: {
                line1: "The purpose of this space is to re-establish slow, human connection. It's about embracing curiosity for what comes \"after,\" without the need for \"all at once.\"",
                line2: "You can send one message every 24 hours. I look forward to hearing from you.",
            },
            placeholder: "Write your message here...",
            cooldown: {
                thankYou: "Thank you for your message!",
                replySoon: "I'll reply soon. Enable notifications to stay in touch.",
                nextMessage: "Next message available in:",
                loading: "Loading...",
            }
        },
        beHuman: {
            title: "Synchronize Connection",
            subtitle: "The grid is a shared consciousness. Other presences are felt. Work in unison to achieve resonance.",
            timerLabel: "Time Elapsed",
            forceSync: "Force Synchronization",
            forceSyncLoading: "Synchronizing...",
            solved: {
                title: "Resonance Achieved",
                description: "All connections are now harmonized.",
                completionTime: "Synchronized in: {time}",
                participants: "{count} presences contributed to the whole.",
            },
            cooldown: {
                nextSync: "Next convergence possible in:",
                loading: "Loading...",
            },
            backToHub: "Return to Hub",
        },
        certification: {
            hub: "Hub",
            title: "Human Made Certification",
            subtitle: "The Organic Product of Technology.",
            p1: "In an era dominated by artificial intelligence, the <bold>Human Made</bold> seal signifies a commitment to pure, unassisted human creativity. This certification is awarded to products, artworks, and services created without the use of generative AI in their core creative process.",
            p2: "It represents the value of human touch, intention, and skill. From handcrafted code to originally composed music, the Human Made certification champions the unique, imperfect, and deeply personal output that only a human mind can conceive.",
            p3: "We believe that while AI is a powerful tool, there is an irreplaceable quality to creations born from human experience, struggle, and inspiration. This project aims to preserve and highlight that quality, offering a clear distinction for consumers who seek authenticity in a digitally saturated world.",
            principles: {
                title: "Core Principles:",
                authenticity: "<bold>Authenticity:</bold> Verifying that the conceptual and executional work is driven by human authors.",
                transparency: "<bold>Transparency:</bold> Clear declaration of tools used, ensuring no generative AI was part of the creative ideation or production.",
                craftsmanship: "<bold>Craftsmanship:</bold> Celebrating the skill, time, and dedication inherent in human-made works.",
            }
        }
    },
    de: {
        header: {
            experiences: "Erlebnisse",
            projects: "Projekte",
            keepInTouch: "In Kontakt bleiben",
            synchronizeConnection: "Verbindung synchronisieren",
            hmCertification: "HM-Zertifizierung",
        },
        hub: {
            title: "Digitale Erlebnisse, menschliche Note.",
            subtitle: "Entdecken Sie interaktive Räume, die darauf ausgelegt sind, das menschliche Element in einer digitalen Welt wiederzuentdecken.",
            card: {
                enterExperience: "Erlebnis betreten",
            },
            card1: {
                title: "In Kontakt bleiben",
                description: "Ein Raum für langsame, bewusste Kommunikation. Senden Sie alle 24 Stunden eine Nachricht und erwarten Sie eine durchdachte Antwort.",
            },
            card2: {
                title: "Verbindung synchronisieren",
                description: "Ein kollaboratives Logikrätsel. Jede Interaktion beeinflusst das Gitter. Arbeiten Sie mit anderen zusammen, um eine vollständige Synchronisierung zu erreichen.",
            }
        },
        keepInTouch: {
            title: "In Kontakt bleiben",
            hub: "Hub",
            intro: {
                line1: "Der Zweck dieses Raumes ist es, eine langsame, menschliche Verbindung wiederherzustellen. Es geht darum, die Neugier auf das, was „danach“ kommt, anzunehmen, ohne das Bedürfnis nach „alles auf einmal“.",
                line2: "Sie können alle 24 Stunden eine Nachricht senden. Ich freue mich darauf, von Ihnen zu hören.",
            },
            placeholder: "Schreiben Sie hier Ihre Nachricht...",
            cooldown: {
                thankYou: "Vielen Dank für Ihre Nachricht!",
                replySoon: "Ich werde bald antworten. Aktivieren Sie Benachrichtigungen, um in Kontakt zu bleiben.",
                nextMessage: "Nächste Nachricht verfügbar in:",
                loading: "Wird geladen...",
            }
        },
        beHuman: {
            title: "Verbindung synchronisieren",
            subtitle: "Das Gitter ist ein gemeinsamer Raum. Andere Verbindungen werden hergestellt. Arbeiten Sie zusammen, um die Synchronisierung zu erreichen.",
            timerLabel: "Verstrichene Zeit",
            forceSync: "Synchronisierung erzwingen",
            forceSyncLoading: "Synchronisiere...",
            solved: {
                title: "Synchronisierung erreicht",
                description: "Alle Verbindungen sind jetzt aktiv.",
                completionTime: "Abschlusszeit: {time}",
                participants: "{count} Interaktionen haben beigetragen.",
            },
            cooldown: {
                nextSync: "Nächste Synchronisierung verfügbar in:",
                loading: "Wird geladen...",
            },
            backToHub: "Zurück zum Hub",
        },
        certification: {
            hub: "Hub",
            title: "Human Made Zertifizierung",
            subtitle: "Das organische Produkt der Technologie.",
            p1: "In einer von künstlicher Intelligenz dominierten Ära bedeutet das <bold>Human Made</bold>-Siegel ein Bekenntnis zu reiner, unassistierter menschlicher Kreativität. Diese Zertifizierung wird an Produkte, Kunstwerke und Dienstleistungen vergeben, die ohne den Einsatz von generativer KI in ihrem kreativen Kernprozess erstellt wurden.",
            p2: "Es repräsentiert den Wert von menschlicher Note, Absicht und Fähigkeit. Von handgeschriebenem Code bis hin zu original komponierter Musik, die Human Made-Zertifizierung setzt sich für das einzigartige, unvollkommene und zutiefst persönliche Ergebnis ein, das nur ein menschlicher Geist konzipieren kann.",
            p3: "Wir glauben, dass KI zwar ein mächtiges Werkzeug ist, aber eine unersetzliche Qualität in Schöpfungen steckt, die aus menschlicher Erfahrung, Kampf und Inspiration geboren werden. Dieses Projekt zielt darauf ab, diese Qualität zu bewahren und hervorzuheben und bietet eine klare Unterscheidung für Verbraucher, die in einer digital gesättigten Welt Authentizität suchen.",
            principles: {
                title: "Grundprinzipien:",
                authenticity: "<bold>Authentizität:</bold> Überprüfung, dass die konzeptionelle und ausführende Arbeit von menschlichen Autoren geleistet wird.",
                transparency: "<bold>Transparenz:</bold> Klare Deklaration der verwendeten Werkzeuge, um sicherzustellen, dass keine generative KI Teil der kreativen Ideenfindung oder Produktion war.",
                craftsmanship: "<bold>Handwerkskunst:</bold> Feier der Fähigkeit, Zeit und Hingabe, die in von Menschen geschaffenen Werken steckt.",
            }
        }
    },
    fr: {
        header: {
            experiences: "Expériences",
            projects: "Projets",
            keepInTouch: "Garder le contact",
            synchronizeConnection: "Synchroniser la Connexion",
            hmCertification: "Certification HM",
        },
        hub: {
            title: "Expériences Numériques, Touche Humaine.",
            subtitle: "Explorez des espaces interactifs conçus pour renouer avec l'élément humain dans un monde numérique.",
            card: {
                enterExperience: "Entrer dans l'Expérience",
            },
            card1: {
                title: "Garder le contact",
                description: "Un espace pour une communication lente et réfléchie. Envoyez un message toutes les 24 heures et attendez une réponse mûrement réfléchie.",
            },
            card2: {
                title: "Synchroniser la Connexion",
                description: "Un puzzle logique collaboratif. Chaque interaction influence la grille. Collaborez avec d'autres pour atteindre une synchronisation complète.",
            }
        },
        keepInTouch: {
            title: "Garder le contact",
            hub: "Hub",
            intro: {
                line1: "Le but de cet espace est de rétablir une connexion humaine lente. Il s'agit d'embrasser la curiosité pour ce qui vient « après », sans avoir besoin de « tout à la fois ».",
                line2: "Vous pouvez envoyer un message toutes les 24 heures. J'ai hâte d'avoir de vos nouvelles.",
            },
            placeholder: "Écrivez votre message ici...",
            cooldown: {
                thankYou: "Merci pour votre message !",
                replySoon: "Je répondrai bientôt. Activez les notifications pour rester en contact.",
                nextMessage: "Prochain message disponible dans :",
                loading: "Chargement...",
            }
        },
        beHuman: {
            title: "Synchroniser la Connexion",
            subtitle: "La grille est un espace partagé. D'autres connexions sont en cours. Collaborez pour atteindre la synchronisation.",
            timerLabel: "Temps écoulé",
            forceSync: "Forcer la synchronisation",
            forceSyncLoading: "Synchronisation...",
            solved: {
                title: "Synchronisation Réussie",
                description: "Toutes les connexions sont maintenant actives.",
                completionTime: "Temps de complétion : {time}",
                participants: "{count} interactions ont contribué.",
            },
            cooldown: {
                nextSync: "Prochaine synchronisation disponible dans :",
                loading: "Chargement...",
            },
            backToHub: "Retour au Hub",
        },
        certification: {
            hub: "Hub",
            title: "Certification Human Made",
            subtitle: "Le Produit Organique de la Technologie.",
            p1: "À une époque dominée par l'intelligence artificielle, le sceau <bold>Human Made</bold> témoigne d'un engagement en faveur d'une créativité humaine pure et non assistée. Cette certification est décernée aux produits, œuvres d'art et services créés sans l'utilisation d'IA générative dans leur processus créatif principal.",
            p2: "Elle représente la valeur de la touche humaine, de l'intention et de la compétence. Du code artisanal à la musique originale, la certification Human Made défend le produit unique, imparfait et profondément personnel que seul un esprit humain peut concevoir.",
            p3: "Nous croyons que si l'IA est un outil puissant, il existe une qualité irremplaçable dans les créations nées de l'expérience, de la lutte et de l'inspiration humaines. Ce projet vise à préserver et à mettre en évidence cette qualité, offrant une distinction claire aux consommateurs qui recherchent l'authenticité dans un monde numériquement saturé.",
            principles: {
                title: "Principes Fondamentaux :",
                authenticity: "<bold>Authenticité :</bold> Vérifier que le travail conceptuel et exécutif est dirigé par des auteurs humains.",
                transparency: "<bold>Transparence :</bold> Déclaration claire des outils utilisés, garantissant qu'aucune IA générative n'a participé à l'idéation ou à la production créative.",
                craftsmanship: "<bold>Artisanat :</bold> Célébrer la compétence, le temps et le dévouement inhérents aux œuvres créées par l'homme.",
            }
        }
    },
    ru: {
        header: {
            experiences: "Впечатления",
            projects: "Проекты",
            keepInTouch: "Оставаться на связи",
            synchronizeConnection: "Синхронизировать соединение",
            hmCertification: "Сертификация HM",
        },
        hub: {
            title: "Цифровые впечатления, человеческое прикосновение.",
            subtitle: "Исследуйте интерактивные пространства, созданные для воссоединения с человеческим элементом в цифровом мире.",
            card: {
                enterExperience: "Войти во впечатление",
            },
            card1: {
                title: "Оставаться на связи",
                description: "Пространство для медленного, осмысленного общения. Отправляйте одно сообщение каждые 24 часа и ожидайте вдумчивого ответа.",
            },
            card2: {
                title: "Синхронизировать соединение",
                description: "Совместная логическая головоломка. Каждое взаимодействие влияет на сетку. Работайте вместе с другими, чтобы достичь полной синхронизации.",
            }
        },
        keepInTouch: {
            title: "Оставаться на связи",
            hub: "Хаб",
            intro: {
                line1: "Цель этого пространства — восстановить медленную, человеческую связь. Речь идет о том, чтобы принять любопытство к тому, что будет «после», без необходимости «все сразу».",
                line2: "Вы можете отправлять одно сообщение каждые 24 часа. С нетерпением жду вашего ответа.",
            },
            placeholder: "Напишите ваше сообщение здесь...",
            cooldown: {
                thankYou: "Спасибо за ваше сообщение!",
                replySoon: "Я скоро отвечу. Включите уведомления, чтобы оставаться на связи.",
                nextMessage: "Следующее сообщение будет доступно через:",
                loading: "Загрузка...",
            }
        },
        beHuman: {
            title: "Синхронизировать соединение",
            subtitle: "Сетка — это общее пространство. Устанавливаются другие соединения. Работайте вместе, чтобы достичь синхронизации.",
            timerLabel: "Прошедшее время",
            forceSync: "Принудительная синхронизация",
            forceSyncLoading: "Синхронизация...",
            solved: {
                title: "Синхронизация достигнута",
                description: "Все соединения теперь активны.",
                completionTime: "Время завершения: {time}",
                participants: "Внесли вклад {count} взаимодействий.",
            },
            cooldown: {
                nextSync: "Следующая синхронизация доступна через:",
                loading: "Загрузка...",
            },
            backToHub: "Вернуться в Хаб",
        },
        certification: {
            hub: "Хаб",
            title: "Сертификация Human Made",
            subtitle: "Органический продукт технологии.",
            p1: "В эпоху, где доминирует искусственный интеллект, печать <bold>Human Made</bold> означает приверженность чистой, человеческой креативности без помощи ИИ. Эта сертификация присуждается продуктам, произведениям искусства и услугам, созданным без использования генеративного ИИ в их основном творческом процессе.",
            p2: "Она представляет ценность человеческого прикосновения, намерения и мастерства. От написанного вручную кода до оригинально сочиненной музыки, сертификация Human Made отстаивает уникальный, несовершенный и глубоко личный результат, который может создать только человеческий разум.",
            p3: "Мы верим, что, хотя ИИ является мощным инструментом, существует незаменимое качество в творениях, рожденных из человеческого опыта, борьбы и вдохновения. Этот проект направлен на сохранение и подчеркивание этого качества, предлагая четкое различие для потребителей, которые ищут подлинность в цифровом насыщенном мире.",
            principles: {
                title: "Основные принципы:",
                authenticity: "<bold>Подлинность:</bold> Проверка того, что концептуальная и исполнительная работа ведется людьми-авторами.",
                transparency: "<bold>Прозрачность:</bold> Четкое указание используемых инструментов, гарантирующее, что генеративный ИИ не был частью творческого процесса или производства.",
                craftsmanship: "<bold>Мастерство:</bold> Восхваление мастерства, времени и преданности, присущих работам, созданным человеком.",
            }
        }
    },
};
