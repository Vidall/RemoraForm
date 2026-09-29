# 🖥️ VPS Hostinger

## O que é?

O servidor onde todas as [[Landing Page Personalizada|landing pages]] dos clientes da [[Remora Link]] serão hospedadas.

## Plano escolhido

**KVM2 da Hostinger**

| Especificação | Valor |
|--------------|-------|
| Tipo | KVM (virtualização real) |
| Provedor | Hostinger |
| Custo mensal | A confirmar (tipicamente ~R$ 40–70/mês) |

## Por que KVM2?

- Recursos dedicados (não compartilhados)
- Controle total do servidor (root access)
- Suporta múltiplos sites com Nginx ou Apache
- Custo fixo independente do número de clientes hospedados

## Estratégia de Hospedagem

- Um único servidor hospeda **todos os clientes**
- Cada cliente = subdomínio ou domínio próprio apontando para o server
- Custo fixo → margem aumenta a cada novo cliente

## Relação com a Mensalidade

O custo do servidor é amortizado através da [[Mensalidade de Hospedagem]] cobrada de cada cliente.

> Exemplo: 10 clientes × R$ 10/mês = R$ 100/mês → cobre o custo da VPS com margem.

## Relacionamentos

- Hospeda: [[Landing Page Personalizada]]
- Cobre custos via: [[Mensalidade de Hospedagem]]
- Pertence a: [[Remora Link]]
- Impacta: [[Modelo de Receita]]
