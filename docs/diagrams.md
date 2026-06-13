# 📊 Diagramet e Projektit / Project Diagrams

Ky dokument përmban diagramet kryesore të arkitekturës dhe proceseve për projektin **Skill Path Architect / AI Guidance Counselor**. Diagramet janë shkruar në formatin **Mermaid** për t'u shfaqur në mënyrë interaktive.

---

## 1. Diagrami i Aktivitetit - Admin / Activity Diagram - Admin

Ky diagram tregon rrjedhën e punës të administratorit në dashboard-in e administrimit: menaxhimin e përdoruesve, stërvitjen dhe promovimin e modeleve të inteligjencës artificiale (ML), si dhe kontrollin e feedback-ut të studentëve.

```mermaid
graph TD
    Start([Start]) --> LoginDecision{Log In?}
    LoginDecision -- JO --> LoginDecision
    LoginDecision -- PO --> Dashboard[Admin Dashboard]
    
    Dashboard --> ForkBar[Fork]
    
    %% Branch 1: Menaxho Perdoruesit
    ForkBar --> ManageUsers[Menaxho Përdoruesit]
    ManageUsers --> ViewUsers[Shiko listën e përdoruesve]
    ManageUsers --> DeleteUser[Fshi përdoruesin]
    
    %% Branch 2: Menaxho Modelet AI
    ForkBar --> ManageModels[Menaxho Modelet AI]
    ManageModels --> TrainModel[Stërvit modele të reja]
    ManageModels --> PromoteModel[Promovo modelin aktiv]
    
    %% Branch 3: Shiko Feedback
    ForkBar --> ViewFeedback[Shiko Feedback]
    ViewFeedback --> DeleteFeedback[Fshi vlerësimet]
    
    ViewUsers --> JoinBar[Join]
    DeleteUser --> JoinBar
    TrainModel --> JoinBar
    PromoteModel --> JoinBar
    DeleteFeedback --> JoinBar
    
    JoinBar --> FinishDecision{Përfundo?}
    FinishDecision -- JO --> Dashboard
    FinishDecision -- PO --> Logout[LOG OUT]
    Logout --> End([End])
```

---

## 2. Diagrami i Procesit: Vlerësimi deri te Rekomandimi / Process Swimlane: Assessment to Recommendation

Ky diagram tregon ndërveprimin e studentit me serverin Express, modelin e parashikimit ML (XGBoost/SVM) dhe modulin LLM për të gjeneruar këshillimin e personalizuar të karrierës.

```mermaid
graph TB
    subgraph Studenti [Studenti / Përdoruesi]
        A1[Plotëson Vlerësimin me 8 Inteligjencat]
        A4[Shikon Rezultatet e Karrierave dhe Përmbledhjen]
        A5[Dërgon Vlerësimin e Kënaqësisë / Feedback]
    end

    subgraph Server [Serveri Express.js Backend]
        B1[Pranon Vlerësimin & Ruan në MongoDB]
        B2[Dërgon të dhënat për parashikim]
        B3[Pranon parashikimet e karrierave]
        B4[Kërkesë për përmbledhje të personalizuar]
        B5[Kthen rezultatet e plota tek Studenti]
    end

    subgraph AI_ML [Modeli ML - Classifier]
        C1[Parashikon Top-5 Karrierat me të përshtatshme]
    end

    subgraph AI_LLM [Modeli LLM - Counselor]
        D1[Gjeneron përmbledhjen dhe planin e veprimit]
    end

    A1 --> B1
    B1 --> B2
    B2 --> C1
    C1 --> B3
    B3 --> B4
    B4 --> D1
    D1 --> B5
    B5 --> A4
    A4 --> A5
```

---

## 3. Arkitektura e Shtresëzuar / Layered Architecture Diagram

Ky diagram tregon strukturën e shtresëzuar të backend-it të aplikacionit (layered architecture) që ndan përgjegjësitë e kontrollorëve, shërbimeve, repozitorëve dhe bazës së të dhënave.

```mermaid
graph TD
    subgraph Presentation_Layer [Shtresa e Prezantimit / Presentation Layer]
        ReactUI[React UI: Dashboard, Assessment Form, Career Library, Admin panel, Chatbot]
    end

    subgraph Application_Layer [Shtresa e Aplikacionit / Application Layer]
        Services[Services: userService, careerService, reviewService, modelExperimentService, chatService, authService]
    end

    subgraph Business_Logic_Layer [Shtresa e Logjikës së Biznesit / Business Logic Layer]
        Rules[Rules & Validators: Validation rules, Scores processing, ML Client, LLM Prompt Handler]
    end

    subgraph Data_Access_Layer [Shtresa e Qasjes në të Dhëna / Data Access Layer]
        Repos[Repositories: userRepository, careerRepository, reviewRepository, modelExperimentRepository, chatRepository]
    end

    subgraph Database_Layer [Shtresa e Bazës së të Dhënave / Database Layer]
        DB[(MongoDB Database / Mongoose ODM)]
    end

    Presentation_Layer --> Application_Layer
    Application_Layer --> Business_Logic_Layer
    Business_Logic_Layer --> Data_Access_Layer
    Data_Access_Layer --> Database_Layer
```