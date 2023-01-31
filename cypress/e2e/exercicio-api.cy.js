/// <reference types="cypress" />

import usuarios from '../contracts/usuarios.contract'

const faker = require('faker-br')

describe('Testes da Funcionalidade Usuários', () => {


    it('Deve validar contrato de USUÁRIOS', () => {
        cy.request('usuarios').then(response => {
            return usuarios.validateAsync(response.body)
        })
    });

    it('Deve listar os USUÁRIOS cadastrados', () => {
        cy.request({
            method: 'GET',
            url: 'usuarios'
        }).then((response) => {
            // expect(response.body.usuarios[3].nome).to.equal('Glauber Souza')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('usuarios')
            expect(response.duration).to.be.lessThan(20)
        })
    });

    it('Deve cadastrar um USUÁRIO com sucesso', () => {
        let usuario = faker.name.firstName() + ' ' + faker.name.lastName()
        //lastName`Nome Sobrenome ${Math.floor(Math.random() * 100000000)}`
        let email = faker.internet.email()

        cy.request({
            method: 'POST',
            url: 'usuarios',
            body: {
                "nome": usuario,
                "email": email,
                "password": "teste@123",
                "administrador": "true"
            },
        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
    });

    it('Deve validar mensagem de erro ao cadastrar USUÁRIO COM EMAIL REPETIDO', () => {
        cy.cadastrarUsuario("Gilberto Souza", "g.souza@qa.com.br", "teste123", "true")
            .then((response) => {
                expect(response.status).to.equal(400)
                expect(response.body.message).to.equal('Este email já está sendo usado')
            })
    });

    it('Deve editar um USUÁRIO já cadastrado', () => {
        cy.request('usuarios').then(response => {
            let id = response.body.usuarios[4]._id
            cy.request({
                method: 'PUT',
                url: `usuarios/${id}`,
                body:
                {
                    "nome": "FirstName LastName Silva",
                    "email": faker.internet.email(),
                    "password": "teste123",
                    "administrador": "false"
                }
            }).then(response => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })
    });

    it('Deve deletar um USUÁRIO previamente cadastrado', () => {
        var email = faker.internet.email()
        cy.cadastrarUsuario("Genivaldo Zezão", email, "teste123", "true")
            .then(response => {
                let id = response.body._id
                cy.request({
                    method: 'DELETE',
                    url: `usuarios/${id}`,

                }).then(response => {
                    expect(response.body.message).to.equal('Registro excluído com sucesso')
                    expect(response.status).to.equal(200)
                })
            })
    });

});