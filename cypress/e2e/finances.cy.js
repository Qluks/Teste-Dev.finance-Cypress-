import { format, prepareLocalStorage } from "../support/util";

context('Dev Finances', () => {

    //1º) Entender o fluxo manulmente
    //2º) Mapear os elementos que vmaos interagir
    //3º) Descrever as interações com o Cypress
    //4º) Adicionar as asserções que a gente precisa

    //Hooks
    beforeEach(() => {
        cy.visit('https://devfinance-agilizei.netlify.app/', {
            onBeforeLoad: (win) => {
                prepareLocalStorage(win)
            }
        })
    });

    it('Cadastrar entradas', () => {

        cy.get('#transaction .button').click()
        cy.get('#description').type('Mesada')
        cy.get('#amount').type(70)
        cy.get('#date').type('2022-08-01')
        cy.get('button').contains('Salvar').click()

        cy.get('#data-table tbody tr').should('have.length', 3)
    });

    it('Cadastrar saídas', () => {

        cy.get('#transaction .button').click()
        cy.get('#description').type('Mesada')
        cy.get('#amount').type(-70)
        cy.get('#date').type('2022-08-01')
        cy.get('button').contains('Salvar').click()

        cy.get('#data-table tbody tr').should('have.length', 3)
    });

    it('Remover entradas e saídas', () => {

        cy.get('td.description')
            .contains('Mesada')
            .parent()
            .find('img[onclick="Transaction.remove(0)"]')
            .click()

        cy.get('td.description')
            .contains('Gasto')
            .siblings()
            .children('img[onclick="Transaction.remove(0)"]')
            .click()

        cy.get('#data-table tbody tr').should('have.length', 0)
    });

    it('Validar saldo com diversas transações', () => {

        let incomes = 0
        let expenses = 0

        cy.get('#data-table tbody tr')
            .each(($el) => {
                cy.get($el).find('td.income, td.expense')
                    .invoke('text').then(text => {
                        if (text.includes('-')) {
                            expenses = expenses + format(text)
                        } else {
                            incomes = incomes + format(text)
                        }
                    })
            })
        
        cy.get('#totalDisplay').invoke('text').then(text => {

            let formatedTotalDisplay = format(text)
            let expectedTotal = incomes + expenses

            expect(formatedTotalDisplay).to.eq(expectedTotal)

        })

    });
});