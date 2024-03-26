import { Content, Header, Page } from "@backstage/core-components";
import { Button, Card, CardContent, Grid, TextField } from "@material-ui/core";
import React, { createRef } from "react";

const nameInputRef: React.RefObject<HTMLInputElement> = createRef<HTMLInputElement>();

export const CreatePage = () => {
    return (
        <Page themeId="something">
            <Header title="Create Funcationality"></Header>
            <Content>
                <Card>
                    <CardContent>
                        <Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="name"
                                    label="Name"
                                    fullWidth
                                    inputRef={nameInputRef}
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" onClick={onSubmitClick}>Submit</Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

            </Content>
        </Page>
    );
};

const onSubmitClick = () => {
    if (nameInputRef.current) {
        alert(nameInputRef.current.value);
    }
}