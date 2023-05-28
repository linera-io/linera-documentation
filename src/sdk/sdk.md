# Linera SDK

In this section we'll be exploring the Linera SDK by building a simple counter application.

This is going to cover most facets of building an app.

## Linera SDK Crate

The `linera-sdk` crate exposes the basic traits required to create a Linera
application.

This section takes you over the steps to create a full Web3 application with a
Linera application for the back end and a React front end.

## Variable Types

The key variables from the `linera-sdk` modules that are important are:

- The [`Timestamp`](TODO) is the Unix time in microseconds, that is from 1970-01-01 00:00:00. See the example `crowd-funding` where
  it is used for implementing a deadline in an application.
- The [`ChainId`](TODO) on which the smart contract is run. This is important when transfering from one microchain to another.
- The [`Amount`](TODO) for the amount of money.
