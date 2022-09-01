import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createComplete, deleteComplete, getCompletes, patchComplete } from '../api/completes-api'
import Auth from '../auth/Auth'
import { Complete } from '../types/Complete'

interface CompletesProps {
  auth: Auth
  history: History
}

interface CompletesState {
  completes: Complete[]
  newCompleteName: string
  loadingCompletes: boolean
}

export class Completes extends React.PureComponent<CompletesProps, CompletesState> {
  state: CompletesState = {
    completes: [],
    newCompleteName: '',
    loadingCompletes: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newCompleteName: event.target.value })
  }

  onEditButtonClick = (completeId: string, name: string, dueDate: string) => {
    this.props.history.push(`/completes/${completeId}/${name}/${dueDate}/edit`)
  }

  onCompleteCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newComplete = await createComplete(this.props.auth.getIdToken(), {
        name: this.state.newCompleteName,
        dueDate
      })
      this.setState({
        completes: [...this.state.completes, newComplete],
        newCompleteName: ''
      })
    } catch {
      alert('Complete creation failed')
    }
  }

  onCompleteDelete = async (completeId: string) => {
    try {
      await deleteComplete(this.props.auth.getIdToken(), completeId)
      this.setState({
        completes: this.state.completes.filter(complete => complete.completeId !== completeId)
      })
    } catch {
      alert('Complete deletion failed')
    }
  }

  onCompleteCheck = async (pos: number) => {
    try {
      const complete = this.state.completes[pos]
      await patchComplete(this.props.auth.getIdToken(), complete.completeId, {
        name: complete.name,
        dueDate: complete.dueDate,
        done: !complete.done
      })
      this.setState({
        completes: update(this.state.completes, {
          [pos]: { done: { $set: !complete.done } }
        })
      })
    } catch {
      alert('Complete deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const completes = await getCompletes(this.props.auth.getIdToken())
      this.setState({
        completes,
        loadingCompletes: false
      })
    } catch (e) {
      alert(`Failed to fetch completes: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">COMPLETES</Header>

        {this.renderCreateCompleteInput()}

        {this.renderCompletes()}
      </div>
    )
  }

  renderCreateCompleteInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New assign',
              onClick: this.onCompleteCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderCompletes() {
    if (this.state.loadingCompletes) {
      return this.renderLoading()
    }

    return this.renderCompletesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Completes
        </Loader>
      </Grid.Row>
    )
  }

  renderCompletesList() {
    return (
      <Grid padded>
        {this.state.completes.map((complete, pos) => {
          return (
            <Grid.Row key={complete.completeId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onCompleteCheck(pos)}
                  checked={complete.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {complete.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {complete.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(complete.completeId, complete.name, complete.dueDate)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onCompleteDelete(complete.completeId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {complete.attachmentUrl && (
                <Image src={complete.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
